#!/bin/bash
export DJANGO_SETTINGS_MODULE=config.settings
echo "Применение миграций Django..."
python3 /app/manage.py collectstatic --noinput --clear
python3 /app/manage.py makemigrations users clients company_structure staffing  medical_activity registry chat external_systems notification
python3 /app/manage.py migrate
python3 /app/entrypoint.py

exec "$@"