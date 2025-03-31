CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
CELERY_TIMEZONE = 'Asia/Yekaterinburg'

CELERY_BEAT_SCHEDULE = {
    'update-medicines-daily': {
        'task': 'apps.external_systems.tasks.update_medicines',
        'schedule': 86400,
    },
}