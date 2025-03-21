from django.contrib.auth import get_user_model
from django.utils.text import slugify

User = get_user_model()

def generate_username_by_fio(first_name: str, last_name: str, patronymic: str | None) -> str:
    """
    Генерирует уникальный username по фамилии, имени и отчеству.
    """

    base_username = slugify(f"{last_name}-{first_name[0]}{('-' + patronymic[0]) if patronymic else ''}")
    username = base_username

    if not User.objects.filter(username=username).exists():
        return username

    # Пробуем более развернутый вариант
    base_username = slugify(f"{last_name}-{first_name}{('-' + patronymic[0]) if patronymic else ''}")
    username = base_username

    if not User.objects.filter(username=username).exists():
        return username

    # Если все еще занято, добавляем счетчик
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}-{counter}"
        counter += 1

    return username
