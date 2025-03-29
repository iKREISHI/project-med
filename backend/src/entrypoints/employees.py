from apps.users.services.generate_username_by_fio import generate_username_by_fio
import os
import json
from apps.staffing.models.employee import Employee
from django.contrib.auth import get_user_model
import re
User = get_user_model()
from apps.company_structure.models import FilialDepartment
from apps.staffing.models.position import Position
from apps.staffing.models.specialization import Specialization
from datetime import timedelta, datetime
from django.contrib.auth.models import Group


def create_users(last_name: str, first_name: str, patronymic: str | None) -> User:
    username = generate_username_by_fio(
        last_name=last_name, first_name=first_name, patronymic=patronymic
    )
    password = "password123"
    if User.objects.filter(username=username).exists():
        return User.objects.filter(username=username).first()

    user = User(username=username)
    user.set_password(password)
    user.save()

    # Получаем группу по названию
    group = Group.objects.get(name='Врач')

    # Добавляем пользователя в группу
    user.groups.add(group)

    print(f"Создан пользователь: {username}")
    return user


def get_departments_by_short_name(short_name: str) -> FilialDepartment | None:
    if not short_name:
        return None
    fd = FilialDepartment.objects.all()
    for d in fd:
        if short_name in d.name:
            return d
    return FilialDepartment.objects.filter(name="Общее отделение").first()


def import_employees_from_json(json_file_path):
    print(f"Импорт сотрудников из файла: {json_file_path}")
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Ошибка при открытии файла {json_file_path}: {e}")
        return

    if Employee.objects.all().count() >= 15:
        return

    for record in data:
        # Преобразуем дату рождения
        dob_str = record.get('date_of_birth')
        date_of_birth = None
        if dob_str:
            try:
                date_of_birth = datetime.strptime(dob_str, '%Y-%m-%d').date()
            except Exception as e:
                print(f"Ошибка при разборе даты рождения {dob_str}: {e}")

        # Преобразуем длительность приёма (например, "8 лет")
        duration = timedelta(minutes=15)

        # Получаем связанные объекты по id (если указаны)
        user_obj = create_users(
            last_name=record.get('last_name'),
            first_name=record.get('first_name'),
            patronymic=record.get('patronymic'),
        )

        department_obj = get_departments_by_short_name(record.get('short_name'))

        position_obj = Position.objects.filter(name='Врач').first()

        specialization_obj = None
        specialization_id = record.get('specialization')
        if specialization_id:
            try:
                specialization_obj = Specialization.objects.get(id=specialization_id)
            except Specialization.DoesNotExist:
                print(f"Специализация с id {specialization_id} не найдена.")

        # Создаем сотрудника
        employee = Employee.objects.create(
            short_description=record.get('short_description'),
            last_name=record.get('last_name'),
            first_name=record.get('first_name'),
            patronymic=record.get('patronymic'),
            gender=record.get('gender', 'U'),
            date_of_birth=date_of_birth,
            snils=record.get('snils'),
            inn=record.get('inn'),
            passport_series=record.get('passport_series'),
            passport_number=record.get('passport_number'),
            # photo=record.get('photo'),  # Обратите внимание: ImageField может потребовать дополнительной обработки URL
            registration_address=record.get('registration_address'),
            actual_address=record.get('actual_address'),
            email=record.get('email'),
            phone=record.get('phone'),
            appointment_duration=duration,
            user=user_obj,
            department=department_obj,
            position=position_obj,
            specialization=specialization_obj
        )
        print(f"Импортирован сотрудник: {employee}")

    print("Импорт сотрудников завершен.")
