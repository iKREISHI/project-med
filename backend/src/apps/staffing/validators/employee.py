from datetime import timedelta
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def validate_appointment_duration(duration: timedelta) -> None:
    """
    Валидатор для поля appointment_duration.
    Если значение задано, оно должно быть положительным.
    """
    if duration is not None:
        if duration <= timedelta(0):
            raise ValidationError(
                _("Длительность приёма должна быть положительной.")
            )

def validate_short_description(description: str) -> None:
    """
    Валидатор для поля short_description.
    Если значение задано, после удаления пробелов его длина должна быть не менее 10 символов.
    """
    if description:
        desc_clean = description.strip()
        if len(desc_clean) < 10:
            raise ValidationError(
                _("Краткое описание должно содержать не менее 10 символов.")
            )
