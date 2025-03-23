dev-entrypoint:
	docker compose exec backend python manage.py makemigrations users clients company_structure staffing  medical_activity registry chat
	docker compose exec backend python manage.py migrate
	docker compose exec backend python entrypoint.py

build-dev:
	docker compose up -d --build
	#dev-entrypoint

run-dev:
	docker compose up -d
	dev-entrypoint

logs-dev:
	docker compose logs

test-dev:
	docker compose exec backend python /app/manage.py test api apps --parallel

logs-dev-django:
	docker compose logs backend

rm-dev:
	docker compose down

rm-v-dev:
	docker compose down -v