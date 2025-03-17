import os
import django

# Установка переменной окружения для конфигурации Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Инициализация приложений Django
django.setup()

from apps.users.models import User
from django.contrib.auth.models import Group, Permission
from apps.staffing.models import Position

SUPERUSER_USERNAME = 'root'
SUPERUSER_PASSWORD = 'root'

# Создание суперпользователя
try:
    if not User.objects.filter(username=SUPERUSER_USERNAME).exists():
        User.objects.create_superuser(
            username=SUPERUSER_USERNAME,
            password=SUPERUSER_PASSWORD,
        )
        print("Суперпользователь успешно создан.")
    else:
        print("Суперпользователь уже существует.")
except Exception as e:
    print(f"Ошибка при создании суперпользователя: {e}")

# Определяем группы и права для них.
# Формат прав: "app_label.codename"
group_permissions = {
    "Врачи": [
        "medical_activity.add_doctorappointment",
        "medical_activity.change_doctorappointment",
        "medical_activity.delete_doctorappointment",
        "medical_activity.view_doctorappointment",
        "clients.view_patient",
        "registry.view_medicalcard",
        "staffing.view_employee",
    ],
    "Медсестры": [
        "medical_activity.view_doctorappointment",
        "clients.view_patient",
        "registry.view_medicalcard",
    ],
    "Администраторы": [
        "admin.add_logentry",
        "admin.change_logentry",
        "admin.delete_logentry",
        "admin.view_logentry",
        "auth.add_group",
        "auth.change_group",
        "auth.delete_group",
        "auth.view_group",
        "auth.add_permission",
        "auth.change_permission",
        "auth.delete_permission",
        "auth.view_permission",
        "contenttypes.add_contenttype",
        "contenttypes.change_contenttype",
        "contenttypes.delete_contenttype",
        "contenttypes.view_contenttype",
        "sessions.add_session",
        "sessions.change_session",
        "sessions.delete_session",
        "sessions.view_session",
        "users.add_user",
        "users.change_user",
        "users.delete_user",
        "users.view_user",
    ],
    "Регистраторы": [
        "clients.add_contractor",
        "clients.change_contractor",
        "clients.delete_contractor",
        "clients.view_contractor",
        "clients.add_patient",
        "clients.change_patient",
        "clients.delete_patient",
        "clients.view_patient",
        "company_structure.add_filial",
        "company_structure.change_filial",
        "company_structure.delete_filial",
        "company_structure.view_filial",
        "company_structure.add_filialdepartment",
        "company_structure.change_filialdepartment",
        "company_structure.delete_filialdepartment",
        "company_structure.view_filialdepartment",
        "registry.add_medicalcard",
        "registry.change_medicalcard",
        "registry.delete_medicalcard",
        "registry.view_medicalcard",
    ]
}

# Создание или обновление групп с правами
for group_name, perms in group_permissions.items():
    group, created = Group.objects.get_or_create(name=group_name)
    if created:
        print(f"Группа '{group_name}' создана.")
    else:
        print(f"Группа '{group_name}' уже существует.")
    # Очистим текущие права и назначим новые
    group.permissions.clear()
    for perm_str in perms:
        try:
            app_label, codename = perm_str.split(".")
            permission = Permission.objects.get(content_type__app_label=app_label, codename=codename)
            group.permissions.add(permission)
        except Permission.DoesNotExist:
            print(f"Право '{perm_str}' не найдено.")
    group.save()
    print(f"Группа '{group_name}' обновлена с правами: {', '.join(perms)}")

# Данные для создания должностей, связанных с группами
positions_data = [
    {
        'name': 'Врач',
        'short_name': 'Врач',
        'minzdrav_position': 'Доктор',
        'group_name': 'Врачи'
    },
    {
        'name': 'Медсестра',
        'short_name': 'Медсестра',
        'minzdrav_position': 'Медсестра',
        'group_name': 'Медсестры'
    },
    {
        'name': 'Администратор',
        'short_name': 'Админ',
        'minzdrav_position': 'Администратор',
        'group_name': 'Администраторы'
    },
    {
        'name': 'Регистратор',
        'short_name': 'Регистратор',
        'minzdrav_position': 'Регистратор',
        'group_name': 'Регистраторы'
    },
]

# Создание или обновление должностей для каждой группы
for data in positions_data:
    try:
        group = Group.objects.get(name=data['group_name'])
    except Group.DoesNotExist:
        print(f"Группа {data['group_name']} не найдена. Пропускаем создание позиции.")
        continue

    position, created = Position.objects.get_or_create(
        group=group,
        name=data['name'],
        defaults={
            'short_name': data['short_name'],
            'minzdrav_position': data['minzdrav_position']
        }
    )
    if created:
        print(f"Создана должность: {position.name} для группы {group.name}")
    else:
        print(f"Должность {position.name} для группы {group.name} уже существует")
