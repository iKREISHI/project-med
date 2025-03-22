#!/bin/bash
export DJANGO_SETTINGS_MODULE=config.settings
echo "Применение миграций Django..."
python3 /app/manage.py makemigrations users clients company_structure staffing  medical_activity registry chat
python3 /app/manage.py migrate
python3 /app/entrypoint.py

# Run web server
gunicorn config.asgi:application -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000