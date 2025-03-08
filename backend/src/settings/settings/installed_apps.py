# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Dependence
    'rest_framework',

    # Apps
    'apps.users.apps.UsersConfig',

    # API apps
    'apps.api.v0.apps.V0Config',
]