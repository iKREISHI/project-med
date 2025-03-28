from apps.users.models import User
from apps.users.services.generate_username_by_fio import generate_username_by_fio


def create_users(last_name: str, first_name: str, patronymic: str | None) -> None:
    for i in range(1, 51):
        username = generate_username_by_fio(last_name, first_name, patronymic)
        password = "password123"  # можно заменить на другой пароль или сгенерировать случайный
        user = User(username=username)
        user.set_password(password)  # хэширование пароля
        user.save()
        print(f"Создан пользователь: {username}")

