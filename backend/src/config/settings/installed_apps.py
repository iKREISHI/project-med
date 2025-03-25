# Application definition

INSTALLED_APPS = [
    'daphne',
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
    'minio_storage',

    # Apps
    'apps.users.apps.UsersConfig',
    'apps.clients.apps.ClientsConfig',
    'apps.staffing.apps.StaffingConfig',
    'apps.company_structure.apps.CompanyStructureConfig',
    'apps.medical_activity.apps.MedicalActivityConfig',
    'apps.registry.apps.RegistryConfig',
    'apps.chat.apps.ChatConfig',

    # API apps
    'api.v0.apps.V0Config',
]