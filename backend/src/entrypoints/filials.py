import os
import json
import django
from apps.company_structure.models import Filial


def import_filials_from_json(json_file_path):
    print(f"Импорт филиалов из файла: {json_file_path}")
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Ошибка при открытии файла {json_file_path}: {e}")
        return
    if Filial.objects.all().count() > 0:
        return

    for record in data:
        filial = Filial.objects.get_or_create(
            name=record.get("name"),
            description=record.get("description"),
            house=record.get("house"),
            building=record.get("building"),
            street=record.get("street"),
            city=record.get("city")
        )
        print(f"Импортирован филиал: {filial}")

    print("Импорт филиалов завершен.")


