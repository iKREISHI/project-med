import re
from django.utils.translation import gettext_lazy as _

from utils.validation_error import raise_validation_error


def _raise_validation_error(message: str = '') -> None:
    raise_validation_error('password', message)


def validate_password_exist(password: str) -> None:
    if not password:
        _raise_validation_error(_('Пароль не должен быть пустым'))


def validate_password_length(password: str) -> None:
    if len(password) < 8:
        _raise_validation_error(_('Пароль должен быть не менее 8 символов.'))


def validate_password_digits(password: str) -> None:
    if not re.search(r'\d', password):
        _raise_validation_error(_('Пароль должен содержать хотя бы одну цифру.'))


def validate_password_uppercase(password: str) -> None:
    if not re.search(r'[A-Z]', password):
        _raise_validation_error(_('Пароль должен содержать хотя бы одну заглавную букву.'))


def validate_password_lowercase(password: str) -> None:
    if not re.search(r'[a-z]', password):
        _raise_validation_error(_('Пароль должен содержать хотя бы одну строчную букву.'))


def validate_password_symbols(password: str) -> None:
    validate_password_digits(password)
    validate_password_uppercase(password)
    validate_password_lowercase(password)


def validate_password(password: str) -> None:
    """
    Валидатор для поля пароль.

    Проверяет, что:
      - пароль имеет не менее 8 символов,
      - содержит хотя бы одну цифру,
      - содержит хотя бы одну заглавную букву,
      - содержит хотя бы одну строчную букву.
    """
    # validate_password_exist(password)
    validate_password_length(password)
    validate_password_symbols(password)

