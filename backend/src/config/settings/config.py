import os
import environ
from pathlib import Path

ENV_PATH = Path(__file__).resolve().parent.parent.parent.parent

env = environ.Env()

environ.Env.read_env(os.path.join(ENV_PATH, '.env'))

# REDIS
REDIS_USER = env('REDIS_USER')
REDIS_USER_PASSWORD = env('REDIS_USER_PASSWORD')
REDIS_PASSWORD = env('REDIS_PASSWORD')
REDIS_IP_ADDRESS = env('REDIS_INSTANCE_IP_ADDRESS')
REDIS_PORT = env('REDIS_INSTANCE_PORT')