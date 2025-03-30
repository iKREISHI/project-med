import os
import json
from apps.medical_activity.models import Diagnosis


def import_diagnoses_from_json(json_file_path):
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Ошибка при открытии файла {json_file_path}: {e}")
        return

    if Diagnosis.objects.count() >= 100:
        return

    for record in data:
        # Формируем описание: добавляем название к оригинальному описанию (если оно есть)
        name = record.get('name')
        description = record.get('name') + " " + record.get('code')

        # Создаем объект Diagnosis без категории
        diagnosis = Diagnosis.objects.get_or_create(
            name=name,
            description=description,
            code=record.get('code'),
        )
        # print(f"Импортирован диагноз: {record.get('name')}")

    print('diagnosis-  OK')
