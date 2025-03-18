from apps.registry.models import MedicalCard


class MedicalCardService:
    """
    Сервис для работы с моделью MedicalCard.
    Предоставляет методы для создания, обновления, получения и удаления медицинской карты.
    """

    @staticmethod
    def create_medical_card(**data) -> MedicalCard:
        """
        Создает новую медицинскую карту с валидацией.

        Аргументы:
            data: Именованные аргументы, соответствующие полям модели MedicalCard.

        Возвращает:
            Созданный объект MedicalCard.

        Исключения:
            ValidationError, если данные не проходят валидацию.
        """
        card = MedicalCard(**data)
        card.full_clean()  # проверка валидаторов модели
        card.save()
        return card

    @staticmethod
    def update_medical_card(card: MedicalCard, **data) -> MedicalCard:
        """
        Обновляет данные медицинской карты.

        Аргументы:
            card: Объект модели MedicalCard, который необходимо обновить.
            data: Именованные аргументы, соответствующие обновляемым полям модели.

        Возвращает:
            Обновленный объект MedicalCard.

        Исключения:
            ValueError, если указано несуществующее поле.
            ValidationError, если обновленные данные не проходят валидацию.
        """
        for field, value in data.items():
            if hasattr(card, field):
                setattr(card, field, value)
            else:
                raise ValueError(f"MedicalCard has no field: {field}")
        card.full_clean()
        card.save()
        return card

    @staticmethod
    def get_medical_card_by_id(id: int) -> MedicalCard:
        """
        Возвращает медицинскую карту по ее UUID.

        Аргументы:
            uuid_str: Строковое представление UUID медицинской карты.

        Возвращает:
            Объект MedicalCard или None, если карта с указанным UUID не найдена.
        """
        return MedicalCard.objects.filter(id=id).first()

    @staticmethod
    def delete_medical_card(card: MedicalCard) -> None:
        """
        Удаляет медицинскую карту из базы данных.

        Аргументы:
            card: Объект модели MedicalCard, который необходимо удалить.
        """
        card.delete()
