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
        position = Position.objects.filter(name=position_name).first()
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

