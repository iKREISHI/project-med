from apps.registry.models.medical_card import MedicalCard

class MedicalCardService:
    """
    Сервис для работы с моделью MedicalCard.
    Предоставляет методы для создания, обновления, получения и удаления медицинской карты.
    """

    @staticmethod
    def create_medical_card(**data) -> MedicalCard:
        """
        Создает новую медицинскую карту с валидацией.
        Поле number исключается из валидации, чтобы допустить его пустоту.
        """
        card = MedicalCard(**data)
        # Исключаем поле "number" из валидации, чтобы пустое значение не мешало автогенерации.
        card.full_clean(exclude=["number"])
        card.save()
        return card

    @staticmethod
    def update_medical_card(card: MedicalCard, **data) -> MedicalCard:
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
        return MedicalCard.objects.filter(id=id).first()

    @staticmethod
    def delete_medical_card(card: MedicalCard) -> None:
        card.delete()
