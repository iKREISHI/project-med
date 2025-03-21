from datetime import timedelta

STATIC_URL = 'static/'
# MEDIA_URL = '/media/'
# MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
from .config import (
    MINIO_ROOT_USER, MINIO_ROOT_PASSWORD,
    MINIO_INSTANCE_ADDRESS
)

# DEFAULT_FILE_STORAGE = 'minio_storage.storage.MinioMediaStorage'
STORAGES = {
    "default": {
        "BACKEND": "minio_storage.storage.MinioMediaStorage",
    },
    # "staticfiles": {
    #     "BACKEND": ""minio_storage.storage.MinioMediaStorage"",
    # },
    # or "django.contrib.staticfiles.storage.StaticFilesStorage",
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}

MINIO_STORAGE_ENDPOINT = MINIO_INSTANCE_ADDRESS
MINIO_STORAGE_ACCESS_KEY = MINIO_ROOT_USER
MINIO_STORAGE_SECRET_KEY = MINIO_ROOT_PASSWORD
MINIO_STORAGE_USE_HTTPS = False
MINIO_URL_EXPIRY_HOURS = timedelta(days=360)
MINIO_STORAGE_MEDIA_BUCKET_NAME = 'media'
MINIO_STORAGE_AUTO_CREATE_MEDIA_BUCKET = True
MINIO_STORAGE_MEDIA_URL = f'http://{MINIO_INSTANCE_ADDRESS}/media/'
MEDIA_URL = f'http://{MINIO_INSTANCE_ADDRESS}/media/'