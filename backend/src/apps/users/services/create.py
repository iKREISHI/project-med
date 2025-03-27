from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from apps.users.validators import validate_username
from apps.users.models import User


class CreateUserService:
    """
    Сервис для создания нового пользователя
    """
    def __init__(self, username: str, password: str, **extra_fields):
        self.username = username
        self.password = password

    def create_user(self, **extra_fields) -> User:
        """
        Создает нового пользователя с заданными параметрами.
        """
        validate_username(self.username)

        user = User.objects.create_user(
            username=self.username,
            password=self.password,
            **extra_fields
        )

        return user

    def create_superuser(self, **extra_fields) -> User:
        """
            Создает нового суперпользователя с заданными параметрами.
        """
        validate_username(self.username)

        user = User.objects.create_superuser(
            username=self.username,
            password=self.password,
            **extra_fields
        )

        return user