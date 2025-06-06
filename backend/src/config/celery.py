import os
from celery import Celery
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
app = Celery('config')
app.config_from_object(settings.CELERY)
app.autodiscover_tasks()
app.conf.broker_connection_retry_on_startup = True
# app.conf.beat_schedule = {}
app.conf.beat_schedule = {
    'empty-task-every-10-seconds': {
        'task': 'apps.external_systems.tasks.empty_task',  # убедитесь, что указан правильный путь к задаче
        'schedule': 10.0,  # интервал выполнения задачи в секундах
    },
    'update-medicine-1-day': {
        'task': 'apps.external_systems.tasks.update_medicine',
        'schedule': 86400.0,
    },
    'update-laboratory-1-day': {
        'task': 'apps.external_systems.tasks.update_laboratory',
        'schedule': 86410.0,
    },
}