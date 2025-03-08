import re
from django.utils.translation import gettext_lazy as _
from utils.validation_error import raise_validation_error


def _raise_patronymic_validation_error(message: str = '') -> None:
    raise_validation_error('patronymic', message)


def validate_patronymic_length(patronymic: str) -> None:
    """
    Если отчество указано, проверяет, что оно содержит не менее 2 символов.
    """
    if patronymic and len(patronymic) < 2:
        _raise_patronymic_validation_error(_('Отчество должно содержать не менее 2 символов.'))


def validate_patronymic_symbols(patronymic: str) -> None:
    """
    Если отчество указано, проверяет, что оно состоит только из букв (латинских или кириллических).
    """
    if patronymic and not re.match(r'^[a-zA-Zа-яА-ЯёЁ]+$', patronymic):
        _raise_patronymic_validation_error(_('Отчество должно содержать только буквы.'))


def validate_patronymic(patronymic: str) -> None:
    validate_patronymic_length(patronymic)
    validate_patronymic_symbols(patronymic)