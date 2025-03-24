import os
import django

# Установка переменной окружения для конфигурации Django и инициализация приложений
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Константы для суперпользователя
SUPERUSER_USERNAME = 'root'
SUPERUSER_PASSWORD = 'root'


def create_superuser_if_not_exists(username, password):
    """
    Создает суперпользователя, если он не существует.
    """
    from apps.users.models import User
    try:
        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username=username, password=password)
            print(f"Суперпользователь '{username}' успешно создан.")
        else:
            print(f"Суперпользователь '{username}' уже существует.")
    except Exception as e:
        print(f"Ошибка при создании суперпользователя: {e}")


def setup_groups_and_permissions():
    """
    Создает группы и назначает им права, согласно заданной конфигурации.
    """
    from django.contrib.auth.models import Group, Permission

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

    for group_name, perms in group_permissions.items():
        group, created = Group.objects.get_or_create(name=group_name)
        if created:
            print(f"Группа '{group_name}' создана.")
        else:
            print(f"Группа '{group_name}' уже существует.")
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


def setup_positions():
    """
    Создает должности (Position) и связывает их с группами.
    """
    from django.contrib.auth.models import Group
    from apps.staffing.models import Position

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


def create_user_and_employee(username, password, first_name, last_name, position_name, group_name, is_superuser=False):
    """
    Создает пользователя (суперпользователя, если is_superuser=True),
    связывает его с должностью (Position) и создает или обновляет запись Employee.
    Также добавляет пользователя в указанную группу.
    """
    from apps.users.models import User
    from apps.staffing.models import Employee, Position
    from django.contrib.auth.models import Group

    # Создание пользователя или суперпользователя
    try:
        if is_superuser:
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_superuser(username=username, password=password)
                print(f"Суперпользователь '{username}' успешно создан.")
            else:
                user = User.objects.get(username=username)
                print(f"Суперпользователь '{username}' уже существует.")
        else:
            user, created = User.objects.get_or_create(username=username)
            if created:
                user.set_password(password)
                user.save()
                print(f"Пользователь '{username}' успешно создан.")
            else:
                print(f"Пользователь '{username}' уже существует.")
    except Exception as e:
        print(f"Ошибка при создании пользователя '{username}': {e}")
        return None

    # Получение объекта должности
    try:
        position = Position.objects.get(name=position_name)
    except Position.DoesNotExist:
        print(f"Должность '{position_name}' не найдена. Проверьте правильность названия.")
        return None

    # Создание или обновление записи Employee
    try:
        employee, created = Employee.objects.get_or_create(
            user=user,
            defaults={
                'first_name': first_name,
                'last_name': last_name,
                'position': position,
            }
        )
        if not created:
            employee.first_name = first_name
            employee.last_name = last_name
            employee.position = position
            employee.save()
            print(f"Сотрудник для пользователя '{username}' обновлен.")
        else:
            print(f"Сотрудник для пользователя '{username}' успешно создан.")
    except Exception as e:
        print(f"Ошибка при создании сотрудника для пользователя '{username}': {e}")
        return None

    # Добавление пользователя в группу
    try:
        group = Group.objects.get(name=group_name)
        user.groups.add(group)
        print(f"Пользователь '{username}' добавлен в группу '{group_name}'.")
    except Group.DoesNotExist:
        print(f"Группа '{group_name}' не найдена.")
    except Exception as e:
        print(f"Ошибка при добавлении пользователя '{username}' в группу '{group_name}': {e}")

    return user, employee


def main():
    # Создание суперпользователя (если необходимо)
    create_superuser_if_not_exists(SUPERUSER_USERNAME, SUPERUSER_PASSWORD)

    # Настройка групп и назначение прав
    setup_groups_and_permissions()

    # Создание должностей, привязанных к группам
    setup_positions()

    # Создание записи Employee для суперпользователя и добавление в группу "Администраторы"
    create_user_and_employee(
        username=SUPERUSER_USERNAME,
        password=SUPERUSER_PASSWORD,
        first_name='Root',
        last_name='User',
        position_name='Администратор',
        group_name='Администраторы',
        is_superuser=True
    )
    create_user_and_employee(
        username='super',
        password='root',
        first_name='Super',
        last_name='User',
        position_name='Администратор',
        group_name='Администраторы',
        is_superuser=True
    )


if __name__ == '__main__':
    main()
