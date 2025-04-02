FROM node:22-alpine AS builder
LABEL authors="ikreishi"

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend .
RUN npm run build


# Базовый образ nginx на Alpine
FROM nginx:alpine

# Удаляем дефолтный конфигурационный файл
RUN rm /etc/nginx/conf.d/default.conf

# Копируем наш конфигурационный файл в контейнер
# Файл default.conf должен находиться в той же директории, что и Dockerfile
COPY docker/nginx/default.conf /etc/nginx/conf.d/

# Копируем собранное React-приложение
# Если у вас сборка React-приложения находится в директории build, она будет доступна по пути /usr/share/nginx/html
COPY --from=builder /app/dist  /usr/share/nginx/html

# Если требуется, можно также добавить статику Django (например, после collectstatic)
# Предполагается, что статика лежит в директории static, тогда она будет доступна по пути /static
# COPY static/ /static/

# Открываем порт 80 для входящих соединений
EXPOSE 80

# Запуск nginx в foreground режиме
CMD ["nginx", "-g", "daemon off;"]
