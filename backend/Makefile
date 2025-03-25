start-venv:
	python3 -m venv venv
	venv/bin/pip install -r requirements.txt

run-docker-containers:
	docker compose --file ../docker-compose.local.dev.yml up redis postgres minio -d

stop-docker-containers:
	docker compose --file ../docker-compose.local.dev.yml down

migrate:
	venv/bin/python3 src/manage.py makemigrations users clients company_structure staffing  medical_activity registry chat
	venv/bin/python3 src/manage.py migrate

entrypoint:
	export DJANGO_SETTINGS_MODULE=config.settings && venv/bin/python3 src/entrypoint.py

collect-static:
	venv/bin/python3 src/manage.py collectstatic

startapp: start-venv run-docker-containers migrate collect-static entrypoint
	start-venv run-docker-containers migrate collect-static entrypoint

test:
	venv/bin/python3 src/manage.py test api apps --parallel

schema-api:
	venv/bin/python3 src/manage.py spectacular --color --file schema.yml
