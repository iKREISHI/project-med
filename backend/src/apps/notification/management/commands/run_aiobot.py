import asyncio
from django.core.management.base import BaseCommand
import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from asgiref.sync import sync_to_async
from django.conf import settings
from apps.notification.models import TelegramUser
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Инициализация бота и диспетчера
bot = Bot(token=settings.TELEGRAM_BOT_TOKEN)
dp = Dispatcher()


@dp.message(Command("start"))
async def start_handler(message: types.Message):
    chat_id = message.chat.id
    user_data = message.from_user

    # Сохранение пользователя в базу, оборачивая синхронный вызов Django ORM в sync_to_async
    user, created = await sync_to_async(TelegramUser.objects.get_or_create)(
        chat_id=chat_id,
        defaults={
            'username': user_data.username,
            'first_name': user_data.first_name,
            'last_name': user_data.last_name,
        }
    )

    if created:
        await message.answer("Вы успешно подписались на бота!")
        logger.info(f"Новый пользователь добавлен: {chat_id}")
    else:
        await message.answer("Вы уже подписаны на бота!")
        logger.info(f"Пользователь {chat_id} уже существует")


async def main():
    try:
        logger.info("Запуск aiogram-бота...")
        await dp.start_polling(bot)
    finally:
        await bot.session.close()


class Command(BaseCommand):
    help = "Запускает Telegram-бота на aiogram"

    def handle(self, *args, **options):
        logger.info("Запуск aiogram-бота...")
        # Запуск асинхронного цикла событий
        asyncio.run(main())
