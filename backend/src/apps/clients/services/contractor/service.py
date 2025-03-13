from django.core.exceptions import ValidationError
from apps.clients.models import Contractor


class ContractorService:
    """
    Сервис для работы с моделью «Контрагент».
    Предоставляет методы для создания, обновления, получения и удаления контрагентов.
    """

    @staticmethod
    def create_contractor(**data) -> Contractor:
        """
        Создает нового контрагента на основе переданных данных.

        Аргументы:
            data: Именованные аргументы, соответствующие полям модели Contractor.

        Возвращает:
            Созданный объект Contractor.

        Исключения:
            ValidationError, если данные не проходят валидацию.
        """
        contractor = Contractor(**data)
        contractor.full_clean()
        contractor.save()
        return contractor

    @staticmethod
    def update_contractor(contractor: Contractor, **data) -> Contractor:
        """
        Обновляет поля контрагента.

        Аргументы:
            contractor: Объект модели Contractor, который необходимо обновить.
            data: Именованные аргументы с новыми значениями полей.

        Возвращает:
            Обновленный объект Contractor.

        Исключения:
            ValueError, если указано поле, которого нет в модели.
            ValidationError, если обновленные данные не проходят валидацию.
        """
        for field, value in data.items():
            if hasattr(contractor, field):
                setattr(contractor, field, value)
            else:
                raise ValueError(f"Контрагент не имеет поля: {field}")
        contractor.full_clean()
        contractor.save()
        return contractor

    @staticmethod
    def get_contractor_by_uuid(uuid_str: str) -> Contractor:
        """
        Возвращает контрагента по его UUID.

        Аргументы:
            uuid_str: Строковое представление UUID контрагента.

        Возвращает:
            Объект Contractor или None, если контрагент с таким UUID не найден.
        """
        return Contractor.objects.filter(uuid=uuid_str).first()

    @staticmethod
    def delete_contractor(contractor: Contractor) -> None:
        """
        Удаляет контрагента из базы данных.

        Аргументы:
            contractor: Объект модели Contractor, который необходимо удалить.
        """
        contractor.delete()
