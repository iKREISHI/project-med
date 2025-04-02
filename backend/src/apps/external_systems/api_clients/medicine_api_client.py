from datetime import datetime
from decimal import Decimal

import requests
from django.core.exceptions import ValidationError
from django.db import transaction, models
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
import logging
from typing import List, Dict, Optional


from apps.external_systems.models import Medicine, Prescription
from config.settings.config import PHARMACY_URL, PHARMACY_TOKEN, PHARMACY_MEDICINE, PHARMACY_AUTH, PHARMACY_PRESCRIPTION

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MedicineAPIClient:
    def __init__(self):
        self.base_url = PHARMACY_URL
        self.auth_token = PHARMACY_TOKEN
        self.session = requests.Session()
        self.session_id = None
        self.auth_endpoint = PHARMACY_AUTH
        self.medicines_endpoint = PHARMACY_MEDICINE
        self.prescription_endpoint = PHARMACY_PRESCRIPTION

    def check_connection(self):
        try:
            self._authenticate()
            return True
        except Exception:
            return False

    def get_session_id(self) -> str:
        """Получение и кэширование session ID"""
        if not self.session_id:
            self.session_id = self._authenticate()
        return self.session_id

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((
                requests.exceptions.ConnectionError,
                requests.exceptions.Timeout,
                requests.exceptions.HTTPError
        )),
        reraise=True
    )
    def _authenticate(self) -> str:
        """Аутентификация на сервере"""
        url = f"{self.base_url}/{self.auth_endpoint}"
        headers = {"Authorization": f"Bearer {self.auth_token}"}

        try:
            response = self.session.get(
                url,
                headers=headers,
                timeout=(3.05, 27),)

            response.raise_for_status()

            data = response.json()
            if data.get('errorCode') != 0:
                raise ValueError(f"Ошибка аутентификации: {data.get('error')}")

            return data['sessionId']

        except requests.exceptions.JSONDecodeError:
            logger.error("Невалидный JSON в ответе аутентификации")
            raise

    def _get_field_max_lengths(self) -> Dict[str, int]:
        """Получаем максимальные длины для всех CharField"""
        return {
            field.name: field.max_length
            for field in Medicine._meta.get_fields()
            if isinstance(field, models.CharField)
        }

    def _validate_and_truncate_fields(self, item: Dict, field_lengths: Dict) -> Dict:
        """Обработка и обрезка полей"""
        processed = {}
        for field, value in item.items():
            # Приводим названия полей к нижнему регистру, если необходимо
            model_field = field.lower()

            if model_field in field_lengths:
                max_len = field_lengths[model_field]
                if len(str(value)) > max_len:
                    logger.warning(
                        f"Обрезка поля {model_field} для записи {item.get('ID')}: "
                        f"{len(value)} символов > {max_len}"
                    )
                    processed[model_field] = str(value)[:max_len]
                else:
                    processed[model_field] = value
            else:
                processed[model_field] = value
        return processed


    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((
                requests.exceptions.ConnectionError,
                requests.exceptions.Timeout,
                requests.exceptions.HTTPError
        )),
        before_sleep=lambda _: logger.warning("Повторная попытка запроса данных..."),
        reraise=True
    )
    def get_and_save_medicines(self):
        """Основной метод для получения и сохранения данных"""
        url = f"{self.base_url}/{self.medicines_endpoint}"


        try:
            self.session.cookies.set("sessionId", self.get_session_id())
            response = self.session.get(
                url,
                timeout=(3.05, 27),
            )

            if response.status_code == 401:
                logger.warning("Сессия устарела, обновляем...")
                self.session_id = None
                return self.get_and_save_medicines()

            response.raise_for_status()
            raw_data = response.json()

            self._save_to_database(raw_data)
            self._send_prescriptions_to_api()

            return True

        except requests.exceptions.JSONDecodeError:
            logger.error("Ошибка декодирования JSON ответа")
            raise
        except Exception as e:
            logger.error(f"Ошибка при получении данных: {str(e)}")
            raise

    @transaction.atomic
    def _save_to_database(self, raw_data: List[Dict]):
        """Сохранение данных в базу с полной обработкой"""
        new_objects = []
        existing_ids = set(Medicine.objects.values_list('external_id', flat=True))
        field_lengths = self._get_field_max_lengths()

        for item in raw_data:
            try:
                # Проверка обязательных полей
                if 'ID' not in item or not item['ID']:
                    raise ValidationError("Отсутствует обязательное поле ID")

                external_id = int(item['ID'])
                if external_id in existing_ids:
                    continue

                # Обработка и валидация данных
                processed_item = self._process_item(item, field_lengths)

                medicine = Medicine(**processed_item)
                medicine.full_clean()
                new_objects.append(medicine)

            except (KeyError, ValueError, TypeError) as e:
                logger.error(f"Ошибка обработки записи {item.get('ID')}: {str(e)}")
            except ValidationError as e:
                logger.error(f"Ошибка валидации для записи {item.get('ID')}: {str(e)}")

        try:
            Medicine.objects.bulk_create(new_objects, batch_size=1000)
            logger.info(f"Успешно добавлено {len(new_objects)} новых записей")
        except Exception as e:
            logger.error(f"Ошибка при сохранении данных: {str(e)}")
            raise

    def _process_item(self, item: Dict, field_lengths: Dict) -> Dict:
        """Полная обработка элемента данных"""
        processed = {
            'external_id': int(item['ID']),
            'date_registration': self._parse_date(item.get('DATE_REGISTRATION')),
            # Добавляем все остальные поля модели
        }

        # Список всех строковых полей модели Medicine
        string_fields = [
            'klp_code', 'smnn_code', 'ktru_code', 'name_trade',
            'standard_inn', 'standard_form', 'standard_doze',
            'name_producer', 'country', 'number_registration',
            'name_unit', 'normalized_dosage', 'normalized_form',
            'name_1_packing', 'name_2_package', 'okpd_2_code',
            'code_atc', 'name_atc', 'tn', 'completeness'
        ]

        # Обработка строковых полей
        for field in string_fields:
            value = item.get(field.upper(), '')
            max_len = field_lengths.get(field, 255)
            processed[field] = str(value)[:max_len] if value else ''

        # Обработка числовых полей
        processed['oksm_code'] = int(item.get('OKSM_CODE', 0))
        processed['okei_code'] = int(item.get('OKEI_CODE', 0))

        # Обработка Decimal полей
        processed['number_units_1'] = self._convert_number(item.get('NUMBER_UNITS_1', '0'))
        processed['number_units_2'] = self._convert_number(item.get('NUMBER_UNITS_2', '0'))

        # Обработка целочисленных полей
        processed['number_packages'] = int(item.get('NUMBER_PACKAGES', 0))

        # Обработка булевых полей
        processed['essential_medicines'] = item.get('ESSENTIAL_MEDICINES', 'Нет') == 'Да'
        processed['narcotic_psychotropic'] = item.get('NARCOTIC_PSYCHOTROPIC', 'Нет') == 'Да'

        return processed

    def _send_prescriptions_to_api(self):
        """Отправка рецептов в API"""
        prescriptions = Prescription.objects.filter(is_signed=True, is_send=False)

        if not prescriptions.exists():
            logger.info("Нет неподтвержденных рецептов для отправки.")
            return

        url = f"{self.base_url}/{self.prescription_endpoint}/"
        session_id = self.get_session_id()
        headers = {
            "Content-Type": "application/json",
            "Cookie": f"sessionId={session_id}"
        }

        for prescription in prescriptions:
            data = self._prepare_prescription_data(prescription)
            logger.info(data)
            try:
                response = requests.post(url, headers=headers, json=data, timeout=(3.05, 27))

                # Если сессия устарела, обновляем session_id и повторяем запрос
                if response.status_code == 401:
                    logger.warning("Сессия устарела, обновляем session_id...")
                    self.session_id = None
                    session_id = self.get_session_id()
                    headers["Cookie"] = f"sessionId={session_id}"
                    response = requests.post(url, headers=headers, json=data, timeout=(3.05, 27))

                response.raise_for_status()
                response_data = response.json()

                if response_data.get('errorCode') == '0':
                    prescription.is_send = True
                    prescription.save(update_fields=["is_send"])
                    logger.info(f"Рецепт {prescription.id} успешно отправлен.")
                else:
                    logger.warning(f"Ошибка при отправке рецепта {prescription.id}: {response_data}")

            except requests.exceptions.RequestException as e:
                logger.error(f"Ошибка при отправке рецепта {prescription.id}: {str(e)}")


    def _prepare_prescription_data(self, prescription: Prescription) -> Dict:
        """
        Формирование JSON-объекта для отправки рецепта.
        Используются следующие поля:
          - docContent: данные берутся из поля doc_content (HTML-текст) с вычислением контрольной суммы;
          - orgSignature: подпись из поля org_signature в формате "data|checksum".
        """
        # Вычисляем checksum для doc_content (HTML-текст)
        if prescription.doc_content:
            doc_data = prescription.doc_content
            doc_checksum = sum(bytearray(doc_data, 'utf-8'))
        else:
            doc_data = ""
            doc_checksum = 0

        # Обрабатываем подпись организации (org_signature) в формате "data|checksum"
        if prescription.org_signature:
            try:
                org_data, org_checksum_str = prescription.org_signature.split("|")
                org_checksum = int(org_checksum_str)
            except (ValueError, AttributeError):
                org_data = ""
                org_checksum = 0
        else:
            org_data = ""
            org_checksum = 0

        return {
            "localUid": str(prescription.id),
            "system": prescription.system,
            "documentNumber": prescription.document_number,
            "creationDateTime": prescription.date_created.isoformat(),
            "patient": {
                "firstName": prescription.patient.first_name,
                "middleName": prescription.patient.patronymic or "",
                "lastName": prescription.patient.last_name,
                "birthDate": prescription.patient.date_of_birth.strftime("%d.%m.%Y"),
                "localId": str(prescription.patient.id),
                "snils": prescription.patient.snils,
                "oms": prescription.patient.oms
            },
            "description": prescription.description,
            "docContent": {
                "data": doc_data,
                "checksum": doc_checksum
            },
            "orgSignature": {
                "data": org_data,
                "checksum": org_checksum
            } if prescription.org_signature else None
        }

    def _parse_date(self, date_str: str) -> Optional[datetime.date]:
        """Преобразование даты с обработкой ошибок"""
        if not date_str:
            return None

        try:
            return datetime.strptime(date_str, "%d.%m.%Y").date()
        except (ValueError, TypeError) as e:
            logger.warning(f"Некорректная дата {date_str}: {str(e)}")
            return None

    def _get_field_max_lengths(self) -> Dict[str, int]:
        """Получаем максимальные длины для всех CharField"""
        return {
            field.name: field.max_length
            for field in Medicine._meta.get_fields()
            if isinstance(field, models.CharField)
        }

    def _validate_and_truncate_fields(self, item: Dict, field_lengths: Dict) -> Dict:
        """Обработка и обрезка полей"""
        processed = {}
        for field, value in item.items():
            # Приводим названия полей к нижнему регистру, если необходимо
            model_field = field.lower()

            if model_field in field_lengths:
                max_len = field_lengths[model_field]
                if len(str(value)) > max_len:
                    logger.warning(
                        f"Обрезка поля {model_field} для записи {item.get('ID')}: "
                        f"{len(value)} символов > {max_len}"
                    )
                    processed[model_field] = str(value)[:max_len]
                else:
                    processed[model_field] = value
            else:
                processed[model_field] = value
        return processed

    @staticmethod
    def _convert_number(value: str) -> Decimal:
        try:
            return Decimal(value.replace(',', '.'))
        except (ValueError, TypeError):
            return Decimal(0)

