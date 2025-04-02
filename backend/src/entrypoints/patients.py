import json
from apps.clients.models import Patient
from apps.users.models import User
from datetime import datetime


def import_patients_from_json(json_file_path):
    print(f'Importing patients from {json_file_path}')
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Ошибка при открытии файла {json_file_path}: {e}")
        return

    if Patient.objects.count() >= 100:
        return

    for record in data:
        # Преобразуем дату рождения, если указана
        dob_str = record.get('date_of_birth')
        date_of_birth = None
        if dob_str:
            try:
                date_of_birth = datetime.strptime(dob_str, '%Y-%m-%d').date()
            except Exception as e:
                print(f"Ошибка при разборе даты рождения {dob_str}: {e}")

        # Пытаемся найти пользователя по id из поля registered_by
        registered_by_id = User.objects.get(pk=1).pk
        registered_by_user = None
        if registered_by_id:
            try:
                registered_by_user = User.objects.get(id=registered_by_id)
            except User.DoesNotExist:
                print(f"Пользователь с id {registered_by_id} не найден.")

        # if Patient.objects.filter(last_name=record.get('last_name'), first_name=record.get('first_name'),)
        # contractor и legal_representative из JSON равны null, передаем как None
        patient = Patient.objects.create(
            last_name=record.get('last_name'),
            first_name=record.get('first_name'),
            patronymic=record.get('patronymic'),
            gender=record.get('gender', 'U'),
            date_of_birth=date_of_birth,
            # date_created будет выставлен автоматически
            snils=record.get('snils'),
            inn=record.get('inn'),
            passport_series=record.get('passport_series'),
            passport_number=record.get('passport_number'),
            photo=None,
            registration_address=record.get('registration_address'),
            actual_address=record.get('actual_address'),
            email=record.get('email'),
            phone=record.get('phone'),
            place_of_work=record.get('place_of_work'),
            additional_place_of_work=record.get('additional_place_of_work'),
            profession=record.get('profession'),
            registered_by=registered_by_user,
            contractor=None,
            legal_representative=None
        )
        print(f"Импортирован пациент: {patient}")

    print("Импорт пациентов завершен.")
