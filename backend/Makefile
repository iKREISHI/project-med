start-venv:
	python3 -m venv venv
	venv/bin/pip install -r requirements.txt

migrate:
	venv/bin/python3 src/manage.py makemigrations users clients company_structure staffing  medical_activity registry
	venv/bin/python3 src/manage.py migrate

entrypoint:
	export DJANGO_SETTINGS_MODULE=config.settings && venv/bin/python3 src/entrypoint.py

startapp: start-venv migrate
	start-venv migrate

test:
	venv/bin/python3 src/manage.py test api apps --parallel

schema-api:
	venv/bin/python3 src/manage.py spectacular --color --file schema.yml
