import os
import django

# Установка переменной окружения для конфигурации Django и инициализация приложений
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Константы для суперпользователя
SUPERUSER_USERNAME = 'root'
SUPERUSER_PASSWORD = 'root'

from entrypoints.groups import setup_groups_and_permissions
from entrypoints.users import (
    create_superuser_if_not_exists,
    create_user_and_employee
)
from entrypoints.position import setup_positions
from entrypoints.diagnosis import import_diagnoses_from_json
from entrypoints.patients import import_patients_from_json
from entrypoints.contractors import import_contractors_from_json
from entrypoints.filials import import_filials_from_json
from entrypoints.specializations import import_specializations_from_json


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

    diagnosis_json_file_path = os.path.join(os.path.dirname(__file__), 'entrypoints/data', 'diagnosis.json')

    import_diagnoses_from_json(diagnosis_json_file_path)

    patients_json_file_path = os.path.join(os.path.dirname(__file__), 'entrypoints/data', 'patients.json')
    import_patients_from_json(patients_json_file_path)

    contractors_json_file_path = os.path.join(os.path.dirname(__file__),'entrypoints/data', 'contractors.json')
    import_contractors_from_json(contractors_json_file_path)

    json_file_path = os.path.join(os.path.dirname(__file__), 'entrypoints/data', 'filials.json')
    import_filials_from_json(json_file_path)

    import_specializations_from_json(os.path.join(os.path.dirname(__file__), 'entrypoints/data', 'specializations.json'))


if __name__ == '__main__':
    main()
