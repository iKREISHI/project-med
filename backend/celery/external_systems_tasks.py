from celery import shared_task
from apps.external_systems.api_clients.medicine_api_client import MedicineAPIClient
import logging

logger = logging.getLogger(__name__)

@shared_task
def update_medicines():
    try:
        client = MedicineAPIClient()
        result = client.get_and_save_medicines()
        return {
            'status': 'success' if result else 'failed',
            'message': 'Data updated successfully' if result else 'Update failed'
        }
    except Exception as e:
        logger.error(f"Ошибка при выполнении задачи: {str(e)}")
        return {
            'status': 'error',
            'message': str(e)
        }