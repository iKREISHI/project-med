start-venv:
	python3 -m venv venv
	venv/bin/pip install -r requirements.txt

migrate:
	venv/bin/python3 src/manage.py makemigrations users
	venv/bin/python3 src/manage.py migrate

entrypoint:
	export DJANGO_SETTINGS_MODULE=settings.settings && venv/bin/python3 src/entrypoint.py

startapp: start-venv migrate
	start-venv migrate

test:
	venv/bin/python3 src/manage.py test apps --parallel

schema-api:
	venv/bin/python3 src/manage.py spectacular --color --file schema.yml
