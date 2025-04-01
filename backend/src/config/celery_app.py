import os
from celery import Celery
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()


from apps.external_systems.tasks import (
    update_medicine, update_laboratory
)
from apps.notification.tasks import (
    send_scheduled_message
)

app = Celery('config')
app.config_from_object(settings.CELERY)
app.conf.broker_connection_retry_on_startup = True
# app.conf.beat_schedule = {}
app.conf.beat_schedule = {
    # 'empty-task': {
    #     'task': 'apps.external_systems.tasks.empty_task',  # убедитесь, что указан правильный путь к задаче
    #     'schedule': 5.0,  # интервал выполнения задачи в секундах
    # },
    'update-medicine-1-day': {
        'task': 'apps.external_systems.tasks.update_medicine',
        'schedule': 86400.0,
    },
    'update-laboratory-1-day': {
        'task': 'apps.external_systems.tasks.update_laboratory',
        'schedule': 86410.0,
    },
    'telegram-bot-send-message': {
        'task': 'apps.notification.tasks.send_scheduled_message',
        'schedule': 10.0,
    }
}
app.autodiscover_tasks()