import os
import json
from apps.clients.models import Contractor


def import_contractors_from_json(json_file_path):
    print(f"Импорт контрагентов из файла: {json_file_path}")
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Ошибка при открытии файла {json_file_path}: {e}")
        return

    if Contractor.objects.count() >= 10:
        return

    for record in data:
        contractor = Contractor.objects.create(
            full_name=record.get('full_name'),
            inn=record.get('inn'),
            kpp=record.get('kpp'),
            bank_account=record.get('bank_account'),
            economic_activity_type=record.get('economic_activity_type'),
            ownership_form=record.get('ownership_form'),
            insurance_organization=record.get('insurance_organization')
        )
        print(f"Импортирован контрагент: {contractor.full_name}")

    print("Импорт контрагентов завершен.")
