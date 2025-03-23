build-dev:
	docker compose -f docker-compose.local.dev.yml up -d --build

run-dev:
	docker compose -f docker-compose.local.dev.yml up -d

logs-dev:
	docker compose -f docker-compose.local.dev.yml logs

test-dev:
	docker compose -f docker-compose.local.dev.yml exec backend python /app/manage.py test api apps --parallel

logs-dev-django:
	docker compose -f docker-compose.local.dev.yml logs backend

rm-dev:
	docker compose -f docker-compose.local.dev.yml down

rm-v-dev:
	docker compose -f docker-compose.local.dev.yml down -v