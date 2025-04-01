import base64
import json
from datetime import datetime
from typing import List, Dict, Optional
import re

import requests
from django.core.exceptions import ValidationError
from django.db import transaction, models
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
import logging

from apps.clients.models import Patient
from apps.external_systems.models import LaboratoryResearch, LaboratoryResearchPDF, Laboratory


from config.settings.config import (
    LAB_RESEARCH_URL,
    LAB_RESEARCH_TOKEN,
    LAB_RESEARCH_AUTH,
    LAB_RESEARCH_INFO,
    LAB_RESEARCH_PDF,
    LAB_RESEARCH_PATIENT  # предполагаем, что в настройках указан эндпоинт для пациентов
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LaboratoryResearchAPIClient:
    def __init__(self):
        self.base_url = LAB_RESEARCH_URL
        self.auth_token = LAB_RESEARCH_TOKEN
        self.session = requests.Session()
        self.session_id = None
        self.auth_endpoint = LAB_RESEARCH_AUTH
        self.info_endpoint = LAB_RESEARCH_INFO
        self.pdf_endpoint = LAB_RESEARCH_PDF
        # Эндпоинт для получения данных о пациентах
        self.patient_endpoint = LAB_RESEARCH_PATIENT

    def check_connection(self) -> bool:
        try:
            self.get_session_id()
            return True
        except Exception as e:
            logger.error(f"Ошибка подключения: {e}")
            return False

    def get_session_id(self) -> str:
        """Получение и кэширование sessionId"""
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
        """Аутентификация на сервере лабораторных исследований"""
        url = f"{self.base_url}/{self.auth_endpoint}"
        headers = {"Authorization": f"Bearer {self.auth_token}"}

        try:
            response = self.session.get(url, headers=headers, timeout=(3.05, 27))
            response.raise_for_status()
            data = response.json()
            if data.get('errorCode') != 0:
                raise ValueError(f"Ошибка аутентификации: {data.get('error')}")
            return data['sessionId']
        except requests.exceptions.JSONDecodeError:
            logger.error("Невалидный JSON в ответе аутентификации")
            raise

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
    def get_lab_research_info(self) -> List[Dict]:
        """Получение списка лабораторных исследований с внешнего API"""
        url = f"{self.base_url}/{self.info_endpoint}"
        self.session.cookies.set("sessionId", self.get_session_id())
        response = self.session.get(url, timeout=(3.05, 27))
        if response.status_code == 401:
            logger.warning("Сессия устарела, обновляем...")
            self.session_id = None
            return self.get_lab_research_info()
        response.raise_for_status()
        return response.json()

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
    def get_lab_research_pdf(self, lab_direction_guid: str) -> Dict:
        url = f"{self.base_url}/{self.pdf_endpoint}/{lab_direction_guid}"
        self.session.cookies.set("sessionId", self.get_session_id())
        response = self.session.get(url, timeout=(3.05, 27))

        if response.status_code == 401:
            logger.warning("Сессия устарела, обновляем...")
            self.session_id = None
            return self.get_lab_research_pdf(lab_direction_guid)

        response.raise_for_status()

        # Проверяем тип содержимого (Content-Type)
        content_type = response.headers.get('Content-Type', '').lower()

        if 'application/json' in content_type:
            try:
                return response.json()
            except ValueError:
                logger.error("Ошибка декодирования JSON для PDF отчета")
                return {}
        elif 'application/pdf' in content_type:
            # Если контент PDF, возвращаем его как бинарные данные
            logger.info("Получен PDF-файл, не JSON")
            return {'pdf': response.content}
        else:
            logger.error(f"Неизвестный тип контента: {content_type}")
            return {}

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((
            requests.exceptions.ConnectionError,
            requests.exceptions.Timeout,
            requests.exceptions.HTTPError
        )),
        before_sleep=lambda _: logger.warning("Повторная попытка запроса пациентов..."),
        reraise=True
    )
    def get_patients(self) -> List[Dict]:
        """Получение списка пациентов с внешнего API"""
        url = f"{self.base_url}/{self.patient_endpoint}"
        self.session.cookies.set("sessionId", self.get_session_id())
        response = self.session.get(url, timeout=(3.05, 27))
        if response.status_code == 401:
            logger.warning("Сессия устарела, обновляем...")
            self.session_id = None
            return self.get_patients()
        response.raise_for_status()
        return response.json()

    def get_and_save_patients(self) -> bool:
        """Основной метод получения данных о пациентах и сохранения их в базу данных"""
        try:
            raw_data = self.get_patients()
            self._save_patients_to_database(raw_data)
            return True
        except requests.exceptions.JSONDecodeError:
            logger.error("Ошибка декодирования JSON ответа при получении пациентов")
            raise
        except Exception as e:
            logger.error(f"Ошибка при получении данных пациентов: {e}")
            raise

    @transaction.atomic
    def _save_patients_to_database(self, raw_data: List[Dict]):
        """
        Сохранение данных о пациентах в базу.
        Внешняя система возвращает список объектов, например:
        [
            {
              "firstName": "Иван",
              "middleName": "Иванович",
              "lastName": "Иванов",
              "birthDate": "15.03.1985",
              "localId": "550e8400-e29b-41d4-a716-446655440000",
              "snils": "20913095341",
              "oms": "1122334455667788"
            }
        ]
        Проверка на существование пациента выполняется по полям snils или oms.
        """
        new_patients = []
        for item in raw_data:
            try:
                snils = item.get('snils')
                oms = item.get('oms')
                if not snils and not oms:
                    logger.warning("Отсутствуют уникальные идентификаторы (snils/oms), пропускаем запись")
                    continue

                # Поиск пациента по snils или oms
                existing = None
                if snils:
                    existing = Patient.objects.filter(snils=snils).first()
                if not existing and oms:
                    existing = Patient.objects.filter(oms=oms).first()

                if existing:
                    continue  # Пациент уже существует

                # Преобразование даты рождения (формат "15.03.1985")
                birth_date_str = item.get('birthDate')
                birth_date = self._parse_date(birth_date_str)

                # Маппинг полей API к полям модели
                patient = Patient(
                    first_name=item.get('firstName', ''),
                    patronymic=item.get('patronymic', ''),
                    last_name=item.get('lastName', ''),
                    date_of_birth=birth_date,
                    snils=snils,
                    oms=oms
                )
                patient.full_clean()
                new_patients.append(patient)
            except (KeyError, ValueError, TypeError) as e:
                logger.error(f"Ошибка обработки пациента с snils {snils} / oms {oms}: {e}")
            except ValidationError as e:
                logger.error(f"Ошибка валидации для пациента с snils {snils} / oms {oms}: {e}")

        try:
            Patient.objects.bulk_create(new_patients, batch_size=1000)
            logger.info(f"Успешно добавлено {len(new_patients)} новых пациентов")
        except Exception as e:
            logger.error(f"Ошибка при сохранении данных пациентов: {e}")
            raise

    def get_and_save_lab_research(self) -> bool:
        """Основной метод получения данных исследований и сохранения их в базу данных"""
        try:
            raw_data = self.get_lab_research_info()
            self._save_lab_research_to_database(raw_data)
            return True
        except requests.exceptions.JSONDecodeError:
            logger.error("Ошибка декодирования JSON ответа")
            raise
        except Exception as e:
            logger.error(f"Ошибка при получении данных: {e}")
            raise

    @transaction.atomic
    def _save_lab_research_to_database(self, raw_data: List[Dict]):
        """Сохранение данных лабораторных исследований в базу"""
        for item in raw_data:
            try:
                lab_direction_guid = item.get('labDirectionGuid')
                if not lab_direction_guid:
                    logger.warning(f"Пропущена запись без labDirectionGuid: {item}")
                    continue

                create_date = self._parse_datetime(item.get('createDate'))
                direction_date = self._parse_datetime(item.get('directionDate'))

                lab_data = item.get('laboratory', {})
                laboratory, _ = Laboratory.objects.get_or_create(
                    guid=lab_data.get('guid'),
                    defaults={'name': lab_data.get('name', ''), 'address': lab_data.get('address', '')}
                )

                obj, created = LaboratoryResearch.objects.update_or_create(
                    lab_direction_guid=lab_direction_guid,
                    defaults={
                        'status': item.get('status', 'process'),
                        'number': item.get('number', ''),
                        'create_date': create_date,
                        'direction_date': direction_date,
                        'previous_research_guid': item.get('previousResearchResultsGuid'),
                        'is_previous_research': item.get('isPreviousResearchPerformed', False),
                        'is_priority': item.get('isPriority', False),
                        'laboratory': laboratory
                    }
                )

                if created:
                    logger.info(f"Добавлено новое исследование: {lab_direction_guid}")
                else:
                    logger.info(f"Обновлено исследование: {lab_direction_guid}")

            except (KeyError, ValueError, TypeError) as e:
                logger.error(f"Ошибка обработки исследования {item.get('labDirectionGuid')}: {e}")
            except ValidationError as e:
                logger.error(f"Ошибка валидации исследования {item.get('labDirectionGuid')}: {e}")

    def _parse_datetime(self, dt_str: Optional[str]) -> Optional[datetime]:
        """Преобразование строки с датой/временем в объект datetime.
           Ожидается формат ISO 8601 (например, '2025-03-10T16:34:27.839Z')"""
        if not dt_str:
            return None
        try:
            if dt_str.endswith('Z'):
                dt_str = dt_str[:-1] + '+00:00'
            return datetime.fromisoformat(dt_str)
        except ValueError as e:
            logger.warning(f"Некорректный формат даты {dt_str}: {e}")
            return None

    def _parse_date(self, date_str: Optional[str]) -> Optional[datetime.date]:
        """Преобразование строки с датой в объект date (ожидается формат '15.03.1985')"""
        if not date_str:
            return None
        try:
            return datetime.strptime(date_str, "%d.%m.%Y").date()
        except ValueError as e:
            logger.warning(f"Некорректный формат даты {date_str}: {e}")
            return None

    def save_pdf_report(self, lab_direction_guid: str) -> bool:
        try:
            pdf_data = self.get_lab_research_pdf(lab_direction_guid)

            # Логируем, что пришло от API
            logger.info(f"Ответ API на PDF-запрос ({lab_direction_guid}): {pdf_data}")

            pdf_base64 = pdf_data.get('pdf')
            if pdf_base64:
                pdf_base64 = re.sub(r"^data:application/pdf;base64,", "", pdf_base64)

            if not pdf_base64:
                logger.error(f"Нет PDF-данных для исследования {lab_direction_guid}, пропуск сохранения")
                return False

            try:
                pdf_binary = base64.b64decode(pdf_base64)
            except base64.binascii.Error as e:
                logger.error(f"Ошибка декодирования PDF Base64: {e}")
                return False

            create_date = self._parse_datetime(pdf_data.get('createDate'))
            research = LaboratoryResearch.objects.filter(lab_direction_guid=lab_direction_guid).first()

            if not research:
                logger.error(f"Исследование с GUID {lab_direction_guid} не найдено")
                return False

            report, created = LaboratoryResearchPDF.objects.update_or_create(
                research=research,
                defaults={'pdf_data': pdf_binary, 'created_at': create_date or datetime.now()}
            )

            if created:
                logger.info(f"Сохранен новый PDF-отчет для {lab_direction_guid}")
            else:
                logger.info(f"Обновлен PDF-отчет для {lab_direction_guid}")

            return True

        except Exception as e:
            logger.error(f"Ошибка при сохранении PDF отчета {lab_direction_guid}: {e}")
            return False