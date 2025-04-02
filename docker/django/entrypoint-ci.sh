#!/bin/bash
export DJANGO_SETTINGS_MODULE=config.settings
echo "Применение миграций Django..."
python3 /app/manage.py collectstatic --noinput --clear
python3 /app/manage.py makemigrations users
python3 /app/manage.py makemigrations clients
python3 /app/manage.py makemigrations company_structure
python3 /app/manage.py makemigrations staffing
python3 /app/manage.py makemigrations medical_activity
python3 /app/manage.py makemigrations registry
python3 /app/manage.py makemigrations chat external_systems notification
python3 /app/manage.py migrate auth
python3 /app/manage.py migrate
#python3 /app/entrypoint.py

exec "$@"