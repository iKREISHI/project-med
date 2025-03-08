from utils.validation_error import raise_validation_error
from django.utils.translation import gettext_lazy as _
import re


def _raise_first_name_validation_error(message: str = '') -> None:
    raise_validation_error('first_name', message)


def validate_first_name_required(first_name: str) -> None:
    """
    Проверяет, что поле имени не пустое.
    """
    if not first_name:
        _raise_first_name_validation_error(_('Пожалуйста, заполните поле имени.'))


def validate_first_name_length(first_name: str) -> None:
    """
    Проверяет, что имя содержит не менее 2 символов.
    """
    if first_name and len(first_name) < 2:
        _raise_first_name_validation_error(_('Имя должно содержать не менее 2 символов.'))


def validate_first_name_symbols(first_name: str) -> None:
    """
    Проверяет, что имя состоит только из букв (латинских или кириллических).
    """
    if first_name and not re.match(r'^[a-zA-Zа-яА-ЯёЁ]+$', first_name):
        _raise_first_name_validation_error(_('Имя должно содержать только буквы.'))


def validate_first_name(first_name: str) -> None:
    validate_first_name_required(first_name)
    validate_first_name_length(first_name)
    validate_first_name_symbols(first_name)