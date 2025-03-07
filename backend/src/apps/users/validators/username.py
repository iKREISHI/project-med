import re
from rest_framework.serializers import ValidationError
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from utils.validation_error import raise_validation_error

User = get_user_model()


def _raise_validation_error(message: str = '') -> None:
    raise_validation_error('username', message)


def validate_username_exists(username: str) -> None:
    if not User.objects.filter(username=username).exists():
        _raise_validation_error(_('Данное имя пользователя не существует.'))


def validate_username_unique(username: str) -> None:
    if User.objects.filter(username=username).exists():
        _raise_validation_error(_('Данное имя пользователя уже существует.'))


def validate_username_length(username: str) -> None:
    if len(username) < 6:
        _raise_validation_error(_('Имя пользователя должно быть не менее 6 символов.'))


def validate_username_symbols(username: str) -> None:
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        _raise_validation_error(
            _('Имя пользователя должно содержать только латинские буквы, цифры и символ подчеркивания.')
        )