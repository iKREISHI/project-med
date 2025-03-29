import os
import json
from apps.staffing.models import Specialization  # Измените путь импорта, если необходимо


def import_specializations_from_json(json_file_path):
    print(f"Импорт специализаций из файла: {json_file_path}")
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Ошибка при открытии файла {json_file_path}: {e}")
        return

    for record in data:
        specialization = Specialization.objects.get_or_create(
            title=record.get("name"),
        )
        print(f"Импортирована специализация: {specialization}")
