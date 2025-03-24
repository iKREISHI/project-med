from datetime import datetime
from apps.users.models import User


class GetUserService:
    """
    Сервис для получения пользователя по различному критерию
    """
    def __init__(self):
        pass

    @staticmethod
    def get_user_by_username(username: str) -> User:
        return User.objects.filter(username=username).first()

    @staticmethod
    def get_user_by_id(pk: int) -> User:
        return User.objects.filter(pk=pk).first()

    @staticmethod
    def get_users_by_date_joined(date: datetime) -> list[User]:
        return User.objects.filter(date_joined=date).all()