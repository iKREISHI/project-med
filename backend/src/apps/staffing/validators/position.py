from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def validate_position_name(value: str) -> None:
    """
    Валидатор для поля name.
    - Обязательно должно быть заполнено.
    - После удаления пробелов значение должно содержать не менее 3 символов.
    """
    if not value or not value.strip():
        raise ValidationError(_("Наименование должности обязательно для заполнения."))
    if len(value.strip()) < 3:
        raise ValidationError(_("Наименование должности должно содержать не менее 3 символов."))

def validate_position_short_name(value: str) -> None:
    """
    Валидатор для поля short_name.
    - Если значение задано, после удаления пробелов должно содержать не менее 2 символов.
    """
    if value:
        if len(value.strip()) < 2:
            raise ValidationError(_("Наименование сокращённое должно содержать не менее 2 символов."))
