from .config import (
    REDIS_URL
)

# REDIS_URL = f"redis://{REDIS_USER}:{REDIS_USER_PASSWORD}@{REDIS_IP_ADDRESS}:{REDIS_PORT}/0"

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [REDIS_URL],
        },
    },
}
