import os
import django

# Установка переменной окружения для конфигурации Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Инициализация приложений Django
django.setup()

from apps.users.models import User

SUPERUSER_USERNAME = 'root'
SUPERUSER_PASSWORD = 'root'

try:
    if not User.objects.filter(username=SUPERUSER_USERNAME).exists():
        User.objects.create_superuser(
            username=SUPERUSER_USERNAME,
            password=SUPERUSER_PASSWORD,
            first_name='Admin',
            last_name='Admin',
            patronymic='Admin',
        )
        print(f"Суперпользователь успешно создан.")
    else:
        print(f"Суперпользователь уже существует.")
except Exception as e:
    print(f"Ошибка при создании суперпользователя: {e}")