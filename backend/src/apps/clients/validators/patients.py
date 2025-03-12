from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_place_of_work(value):
    """
    Валидатор для поля «Место работы».
    Проверяет, что если значение задано, оно содержит не менее 3 символов (без учета пробелов).
    """
    if value and len(value.strip()) < 3:
        raise ValidationError(
            _("Место работы должно содержать не менее 3 символов."),
            code="invalid"
        )


def validate_additional_place_of_work(value):
    """
    Валидатор для поля «Дополнительное место работы».
    Проверяет, что если значение задано, оно содержит не менее 3 символов (без учета пробелов).
    """
    if value and len(value.strip()) < 3:
        raise ValidationError(
            _("Дополнительное место работы должно содержать не менее 3 символов."),
            code="invalid"
        )


def validate_profession(value):
    """
    Валидатор для поля «Профессия».
    Проверяет, что если значение задано, оно содержит не менее 2 символов (без учета пробелов).
    """
    if value and len(value.strip()) < 2:
        raise ValidationError(
            _("Профессия должна содержать не менее 2 символов."),
            code="invalid"
        )


def validate_legal_representative(instance):
    """
    Валидатор для поля «Законный представитель».
    Проверяет, что пациент не может быть назначен своим собственным законным представителем.
    Этот валидатор необходимо вызывать из метода clean() модели Patient.
    """
    if instance.legal_representative and instance.pk and instance.legal_representative.pk == instance.pk:
        raise ValidationError(
            _("Пациент не может быть своим собственным законным представителем."),
            code="invalid"
        )
