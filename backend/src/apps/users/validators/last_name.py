import re
from django.utils.translation import gettext_lazy as _
from utils.validation_error import raise_validation_error


def _raise_last_name_validation_error(message: str = '') -> None:
    raise_validation_error('last_name', message)


def validate_last_name_required(last_name: str) -> None:
    """
    Проверяет, что поле фамилии не пустое.
    """
    if not last_name:
        _raise_last_name_validation_error(_('Пожалуйста, заполните поле фамилии.'))


def validate_last_name_length(last_name: str) -> None:
    """
    Проверяет, что фамилия содержит не менее 2 символов.
    """
    if last_name and len(last_name) < 2:
        _raise_last_name_validation_error(_('Фамилия должна содержать не менее 2 символов.'))


def validate_last_name_symbols(last_name: str) -> None:
    """
    Проверяет, что фамилия состоит только из букв (латинских или кириллических).
    """
    if last_name and not re.match(r'^[a-zA-Zа-яА-ЯёЁ]+$', last_name):
        _raise_last_name_validation_error(_('Фамилия должна содержать только буквы.'))
