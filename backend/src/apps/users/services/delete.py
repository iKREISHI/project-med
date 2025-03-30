from apps.users.models import User

class DeleteUserService:
    """
    Сервис для удаления пользователя.
    """

    def __init__(self, user: User):
        """
        Инициализирует сервис с объектом пользователя, который необходимо удалить.
        """
        if not isinstance(user, User):
            raise ValueError("Неверный объект пользователя")
        self.user = user

    def delete_user(self) -> None:
        """
        Удаляет пользователя из базы данных.

        Возвращает:
            None

        Исключения:
            ValueError: если объект пользователя не задан или не валиден.
        """
        self.user.delete()
