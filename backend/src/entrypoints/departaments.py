import os
import json

from apps.company_structure.models import FilialDepartment, Filial
from apps.staffing.models import Employee


def import_filial_departments_from_json(json_file_path):
    print(f"Импорт отделений филиала из файла: {json_file_path}")
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Ошибка при открытии файла {json_file_path}: {e}")
        return

    for filial_object in Filial.objects.all():
        if not filial_object:
            break

        for record in data:

            # Создаем отделение филиала
            department = FilialDepartment.objects.get_or_create(
                name=record.get('name'),
                # director=director,
                filial=filial_object,
            )
            print(f"Импортировано отделение: {record.get('name')}")