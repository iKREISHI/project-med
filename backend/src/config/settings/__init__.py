from split_settings.tools import include
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Include
include('commons.py')
include('installed_apps.py')
include('locale.py')
include('rest.py')
include('redis_channel.py')