import os
from .locale import TIME_ZONE


CELERY = {
    'broker_url': os.environ.get('CELERY_BROKER_URL'),
    'worker_hijack_root_logger': False,
    'timezone': TIME_ZONE,
    'beat_schedule': 'django_celery_beat.schedulers:DatabaseScheduler',
}