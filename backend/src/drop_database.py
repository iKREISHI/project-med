#!/usr/bin/env python
import os
import sys
import django
from django.conf import settings
import dj_database_url
import psycopg2

# Инициализация Django для доступа к settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()


def drop_postgres_database():
    # Получаем DATABASE_URL из settings
    global cursor, conn
    database_url = settings.DATABASES_URL
    # Парсим DATABASE_URL с помощью dj_database_url
    db_config = dj_database_url.parse(database_url)

    db_name = db_config.get('NAME')
    user = db_config.get('USER')
    password = db_config.get('PASSWORD')
    host = db_config.get('HOST') or 'localhost'
    port = db_config.get('PORT') or 5432

    try:
        # Подключаемся к служебной базе данных 'postgres'
        conn = psycopg2.connect(dbname='postgres', user=user, password=password, host=host, port=port)
        conn.autocommit = True
        cursor = conn.cursor()

        # Завершаем все активные соединения с целевой базой
        cursor.execute(f"""
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = '{db_name}'
              AND pid <> pg_backend_pid();
        """)

        # Дропаем базу данных, если она существует, и создаём её заново
        cursor.execute(f"DROP DATABASE IF EXISTS {db_name};")
        cursor.execute(f"CREATE DATABASE {db_name};")
        print(f"PostgreSQL база данных '{db_name}' успешно пересоздана.")

    except Exception as e:
        print(f"Ошибка при пересоздании базы данных: {e}")
        sys.exit(1)

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


if __name__ == '__main__':
    drop_postgres_database()
