import os
import django
import logging

from apps.external_systems.api_clients.laboratory_api_client import LaboratoryResearchAPIClient

# Настройка окружения Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.external_systems.models import LaboratoryResearch, LaboratoryResearchPDF

logger = logging.getLogger(__name__)


def run_full_import():
    client = LaboratoryResearchAPIClient()

    if client.get_and_save_patients():
        logger.info("Данные о пациентах успешно импортированы.")
    else:
        logger.error("Импорт данных о пациентах завершился с ошибками.")

    if client.get_and_save_lab_research():
        logger.info("Данные о лабораторных исследованиях успешно импортированы.")
    else:
        logger.error("Импорт данных о лабораторных исследованиях завершился с ошибками.")

    researches = LaboratoryResearch.objects.filter(pdf_report__isnull=True)
    for research in researches:
        try:
            client.save_pdf_report(str(research.lab_direction_guid))
        except Exception as e:
            logger.error(f"Ошибка при загрузке PDF для исследования {research.lab_direction_guid}: {e}")

if __name__ == "__main__":
    run_full_import()