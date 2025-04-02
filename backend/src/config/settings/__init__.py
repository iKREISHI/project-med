from split_settings.tools import include
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
from .config import TELEGRAM_BOT_TOKEN
from .config import DATABASE_URL

# Include
include('commons.py')
include('installed_apps.py')
include('locale.py')
include('rest.py')
include('redis_channel.py')
include('logger.py')
include('middleware.py')
include('storage.py')
include('celery.py')