import logging
from config.celery import app as celery_app


logger = logging.getLogger('django')

@celery_app.task
def empty_task():
    logger.info('Empty task')

    return None