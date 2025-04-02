import os
from email.policy import default

import environ
from pathlib import Path

from django.template.defaultfilters import default

# Определяем корневую директорию, где должен находиться файл .env.
ENV_PATH = Path(__file__).resolve().parents[2]

# Инициализируем объект окружения
env = environ.Env()

# Определяем путь к файлу .env
env_file = ENV_PATH / '.env'

# Если файл .env существует, загружаем его
if env_file.exists():
    environ.Env.read_env(str(env_file))

# ---------------------------
# Чтение переменных окружения
# ---------------------------

# POSTGRES
DATABASES_URL = env.db(
    'DATABASE_URL',
    default='postgres://postgres:postgres@127.0.0.1:5432/med_db'
)

DATABASE_URL = env('DATABASE_URL', default='postgres://postgres:postgres@127.0.0.1:5432/med_db')

# REDIS
REDIS_USER = env('REDIS_USER', default='root')
REDIS_USER_PASSWORD = env('REDIS_USER_PASSWORD', default='root')
REDIS_PASSWORD = env('REDIS_PASSWORD', default='redis@password')
REDIS_IP_ADDRESS = env('REDIS_INSTANCE_IP_ADDRESS', default='127.0.0.1')
REDIS_PORT = env('REDIS_INSTANCE_PORT', default='6380')
REDIS_URL = env('REDIS_URL', default='redis://root:root@127.0.0.1:6379/0')

CELERY_BROKER_URL = env('CELERY_BROKER_URL', default='amqp://guest:guest@127.0.0.1:5672/')


# MINIO
MINIO_ROOT_USER = env('MINIO_ROOT_USER', default='minioroot')
MINIO_ROOT_PASSWORD = env('MINIO_ROOT_PASSWORD', default='minioroot')
MINIO_INSTANCE_ADDRESS = env('MINIO_INSTANCE_ADDRESS', default='127.0.0.1:9000')

SERVER_BACKEND_IP_ADDRESS = env('SERVER_BACKEND_IP_ADDRESS', default='127.0.0.1:8000')

# External API`s
PHARMACY_URL = env('PHARMACY_URL', default='http://87.228.37.14:61509')
PHARMACY_AUTH = env('PHARMACY_AUTH', default='auth')
PHARMACY_MEDICINE = env('PHARMACY_MEDICINE', default='medicines')
PHARMACY_PRESCRIPTION= env('PHARMACY_PRESCRIPTION', default='prescriptionXml')
PHARMACY_TOKEN = env('PHARMACY_TOKEN', default='550e8400-e29b-41d4-a716-446655440000')

LAB_RESEARCH_URL = env('LABORATORY_URL', default='http://87.228.37.14:61510')
LAB_RESEARCH_AUTH = env('LABORATORY_AUTH', default='auth')
LAB_RESEARCH_TOKEN = env('LAB_RESEARCH_TOKEN', default='550e8400-e29b-41d4-a716-446655440000')
LAB_RESEARCH_INFO = env('LAB_RESEARCH_INFO', default='labReserchInfo')
LAB_RESEARCH_PDF = env('LAB_RESEARCH_PDF', default='labReserchPdf')
LAB_RESEARCH_PATIENT = env('patient', default='patient')

GIGACHAT_API_KEY = env('GIGACHAT_API_KEY', default='')
TELEGRAM_BOT_TOKEN = env('TELEGRAM_BOT_TOKEN', default='')

