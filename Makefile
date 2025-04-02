build-dev:
	cp .env.sample .env
	docker compose -f docker-compose.local.dev.yml up -d --build

run-dev:
	docker compose -f docker-compose.local.dev.yml up -d

stop-dev:
	docker compose -f docker-compose.local.dev.yml stop

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

drop-db:
	docker compose -f docker-compose.local.dev.yml exec postgres /bin/bash psql -U postgres -d med_db -c "DO $$$$ DECLARE rec RECORD; BEGIN FOR rec IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(rec.tablename) || ' CASCADE'; END LOOP; END $$$$;"