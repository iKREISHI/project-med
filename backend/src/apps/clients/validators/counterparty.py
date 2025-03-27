from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from apps.abstract_models.person.validators import (
    validate_inn as inn_validator
)

def validate_full_name(value):
    """
    Проверяет, что поле "Полное наименование" имеет минимум 3 символа.
    """
    if len(value.strip()) < 3:
        raise ValidationError(
            _("Полное наименование должно содержать минимум 3 символа."),
            code="invalid"
        )

def validate_inn(value):
    """
    Проверяет, что ИНН состоит только из цифр и имеет длину 10 или 12 символов.
    """
    inn_validator(value)

def validate_kpp(value):
    """
    Если КПП указано, проверяет, что оно состоит только из цифр и имеет ровно 9 символов.
    """
    if value:
        if not value.isdigit():
            raise ValidationError(
                _("КПП должен состоять только из цифр."),
                code="invalid"
            )
        if len(value) != 9:
            raise ValidationError(
                _("КПП должен содержать ровно 9 цифр."),
                code="invalid_length"
            )

def validate_bank_account(value):
    """
    Если основной банковский счёт указан, проверяет, что он состоит только из цифр
    (пробелы игнорируются).
    """
    if value:
        account = value.replace(" ", "")
        if not account.isdigit():
            raise ValidationError(
                _("Основной банковский счёт должен состоять только из цифр."),
                code="invalid"
            )

def validate_economic_activity_type(value):
    """
    Если указан вид экономической деятельности, проверяет, что значение имеет минимум 3 символа.
    """
    if value and len(value.strip()) < 3:
        raise ValidationError(
            _("Вид экономической деятельности должен содержать минимум 3 символа."),
            code="invalid"
        )

def validate_ownership_form(value):
    """
    Если указана форма собственности, проверяет, что значение имеет минимум 2 символа.
    """
    if value and len(value.strip()) < 2:
        raise ValidationError(
            _("Форма собственности должна содержать минимум 2 символа."),
            code="invalid"
        )

def validate_insurance_organization(value):
    """
    Если указана страховая организация, проверяет, что значение имеет минимум 3 символа.
    """
    if value and len(value.strip()) < 3:
        raise ValidationError(
            _("Страховая организация должна содержать минимум 3 символа."),
            code="invalid"
        )
