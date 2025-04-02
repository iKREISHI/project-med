import logging
from config.celery import app as celery_app
from .api_clients.update_medicine_data import update_medicine_data
from .api_clients.update_laboratory_data import run_full_import

logger = logging.getLogger('django')


@celery_app.task
def empty_task():
    logger.info('Empty task')

    return None


@celery_app.task
def update_medicine():
    try:
        update_medicine_data()
        logger.info('Update medicine data')

    except Exception as e:
        logger.error(e)


@celery_app.task
def update_laboratory():
    try:
        run_full_import()
        logger.info('Update laboratory data')

    except Exception as e:
        logger.error(e)