from django.contrib.auth.hashers import make_password
from apps.users.models import User
from django.utils.translation import gettext_lazy as _
from .get import GetUserService


class UpdateUserService:
    """
    Сервис для обновления полей модели пользователя.
    """

    def __init__(self, user: User):
        self.user = user

    def update_fields(self, **kwargs) -> User:
        """
        Обновляет поля пользователя согласно переданным именованным аргументам.

        Аргументы:
            kwargs: Именованные аргументы, соответствующие полям модели User.

        Возвращает:
            Обновлённый объект пользователя.

        Исключения:
            ValueError, если указано поле, которого нет в модели.
        """

        for field, value in kwargs.items():
            if hasattr(self.user, field):
                setattr(self.user, field, value)
            else:
                raise ValueError(_(f"Пользователь не имеет поля: {field}"))

        self.user.save()
        return self.user

    def update_username(self, new_username: str) -> User:
        """
        Обновляет username пользователя
        """
        if not new_username:
            raise ValueError(_('Имя пользователя не может быть пустым.'))
        get_user = GetUserService()
        if get_user.get_user_by_username(new_username):
            raise ValueError(_('Пользователь с таким именем уже существует'))

        self.user.username = new_username

        self.user.save()
        return self.user


    def update_password(self, new_password: str) -> User:
        """
            Обновляет пароль пользователя
        """
        if not new_password:
            raise ValueError(_('Новый пароль не может быть пустым'))

        self.user.password = make_password(new_password)

        self.user.save()
        return self.user

    def update_active_status(self, active_status: bool) -> User:
        """
            Обновляет статус active
        """
        self.user.is_active = active_status
        self.user.save()
        return self.user
        