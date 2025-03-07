import re
from django.core.exceptions import ValidationError
from django.core.validators import validate_email as django_validate_email
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from utils.validation_error import raise_validation_error

User = get_user_model()


def _raise_email_validation_error(message: str = '') -> None:
    raise_validation_error('email', message)


def validate_email_format(email: str) -> None:
    """
    Валидатор проверяет формат почты с использованием стандартного валидатора Django.
    """
    if email:
        try:
            django_validate_email(email)
        except ValidationError:
            _raise_email_validation_error(_('Неверный формат почты.'))


def validate_email_unique(email: str) -> None:
    """
    Валидатор проверяет, что указанная почта уникальна, если она задана.
    """
    if email and User.objects.filter(email=email).exists():
        _raise_email_validation_error(_('Пользователь с данной почтой уже существует.'))
