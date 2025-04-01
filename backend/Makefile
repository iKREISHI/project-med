start-venv:
	python3 -m venv venv
	venv/bin/pip install -r requirements.txt

run-docker-containers:
	docker compose --file ../docker-compose.local.dev.yml up redis postgres minio rabbitmq celery_worker celery_beat tg_bot -d

up-celery:
	docker compose --file ../docker-compose.local.dev.yml up celery_worker celery_beat -d --build

down-celery:
	docker compose --file ../docker-compose.local.dev.yml down celery_worker celery_beat -v

logs-celery-worker:
	docker compose --file ../docker-compose.local.dev.yml logs celery_worker

logs-celery-beat:
	docker compose --file ../docker-compose.local.dev.yml logs celery_beat

up-bot:
	docker compose --file ../docker-compose.local.dev.yml up tg_bot -d

down-bot:
	docker compose --file ../docker-compose.local.dev.yml down tg_bot

logs-bot:
	docker compose --file ../docker-compose.local.dev.yml logs tg_bot

restart-celery:
	docker compose --file ../docker-compose.local.dev.yml exec celery_worker /bin/bash -c "rm -rf /app/celerybeat-schedule.*"
	docker compose --file ../docker-compose.local.dev.yml restart celery_worker
	docker compose --file ../docker-compose.local.dev.yml exec celery_beat /bin/bash -c "rm -rf /app/celerybeat-schedule.*"
	docker compose --file ../docker-compose.local.dev.yml restart celery_beat

stop-docker-containers:
	docker compose --file ../docker-compose.local.dev.yml down

migrate:
	venv/bin/python3 src/manage.py makemigrations users clients company_structure staffing  medical_activity registry chat external_systems django_celery_results notification
	venv/bin/python3 src/manage.py migrate

entrypoint:
	export DJANGO_SETTINGS_MODULE=config.settings && venv/bin/python3 src/entrypoint.py

collect-static:
	venv/bin/python3 src/manage.py collectstatic

startapp: start-venv run-docker-containers migrate collect-static entrypoint

test:
	venv/bin/python3 src/manage.py test api apps --parallel

schema-api:
	venv/bin/python3 src/manage.py spectacular --color --file schema.yml
