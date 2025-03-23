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