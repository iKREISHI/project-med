from django.core.exceptions import ValidationError
from apps.clients.models import Patient


class PatientService:
    """
    Сервис для работы с моделью Пациент.
    Предоставляет методы для создания, обновления, получения и удаления пациентов.
    """

    @staticmethod
    def create_patient(**data) -> Patient:
        """
        Создает нового пациента с валидацией.

        Аргументы:
            data: Именованные аргументы, соответствующие полям модели Patient.

        Возвращает:
            Созданный объект Patient.

        Исключения:
            ValidationError, если данные не проходят валидацию.
        """
        patient = Patient(**data)
        patient.full_clean()
        patient.save()
        return patient

    @staticmethod
    def update_patient(patient: Patient, **data) -> Patient:
        """
        Обновляет данные пациента.

        Аргументы:
            patient: Объект модели Patient, который нужно обновить.
            data: Именованные аргументы, соответствующие обновляемым полям модели.

        Возвращает:
            Обновленный объект Patient.

        Исключения:
            ValueError, если указано поле, которого нет в модели.
            ValidationError, если обновленные данные не проходят валидацию.
        """
        for field, value in data.items():
            if hasattr(patient, field):
                setattr(patient, field, value)
            else:
                raise ValueError(f"Пациент не имеет поля: {field}")
        patient.full_clean()
        patient.save()
        return patient

    @staticmethod
    def get_patient_by_uuid(uuid: str) -> Patient:
        """
        Возвращает пациента по его UUID.

        Аргументы:
            uuid: Строковое представление UUID пациента.

        Возвращает:
            Объект Patient или None, если пациент с указанным UUID не найден.
        """
        return Patient.objects.filter(uuid=uuid).first()

    @staticmethod
    def delete_patient(patient: Patient) -> None:
        """
        Удаляет пациента из базы данных.

        Аргументы:
            patient: Объект модели Patient, который требуется удалить.
        """
        patient.delete()
