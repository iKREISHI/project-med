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
    'drf_spectacular',
    'drf_spectacular_sidecar',

    # Apps
    'apps.users.apps.UsersConfig',
    'apps.clients.apps.ClientsConfig',
    'apps.staffing.apps.StaffingConfig',

    # API apps
    'api.v0.apps.V0Config',
]