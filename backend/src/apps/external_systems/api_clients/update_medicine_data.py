import django
import os

from apps.external_systems.api_clients.medicine_api_client import MedicineAPIClient

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()


def update_medicine_data():
    client = MedicineAPIClient()
    try:
        client.get_and_save_medicines()
    except Exception as e:
        print(f"Синхронизация завершилась ошибкой: {str(e)}")

if __name__ == "__main__":
    update_medicine_data()