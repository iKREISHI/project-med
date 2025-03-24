import os
import environ
from pathlib import Path

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

# REDIS
REDIS_USER = env('REDIS_USER', default='root')
REDIS_USER_PASSWORD = env('REDIS_USER_PASSWORD', default='root')
REDIS_PASSWORD = env('REDIS_PASSWORD', default='redis@password')
REDIS_IP_ADDRESS = env('REDIS_INSTANCE_IP_ADDRESS', default='127.0.0.1')
REDIS_PORT = env('REDIS_INSTANCE_PORT', default='6380')
REDIS_URL = env('REDIS_URL', default='redis://root:root@127.0.0.1:6379/0')

# MINIO
MINIO_ROOT_USER = env('MINIO_ROOT_USER', default='minioroot')
MINIO_ROOT_PASSWORD = env('MINIO_ROOT_PASSWORD', default='minioroot')
MINIO_INSTANCE_ADDRESS = env('MINIO_INSTANCE_ADDRESS', default='127.0.0.1:9000')

SERVER_BACKEND_IP_ADDRESS = env('SERVER_BACKEND_IP_ADDRESS', default='127.0.0.1:8000')
