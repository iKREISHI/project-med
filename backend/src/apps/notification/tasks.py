from celery import shared_task
import asyncio
from asgiref.sync import sync_to_async
from aiogram import Bot
from django.conf import settings
from .models import TelegramUser, Notification
from apps.staffing.models.employee import Employee
import logging

logger = logging.getLogger(__name__)


@shared_task
def send_scheduled_message():
    async def send_messages():
        bot = Bot(token=settings.TELEGRAM_BOT_TOKEN)

        # Получаем все уведомления с предзагрузкой поля user
        notifications = await sync_to_async(list)(
            Notification.objects.all().select_related('user')
        )

        for notification in notifications:
            # Используем user_id вместо notification.user, чтобы избежать ленивой загрузки
            try:
                employee = await sync_to_async(Employee.objects.get)(user_id=notification.user_id)
            except Employee.DoesNotExist:
                logger.info(f"Сотрудник для пользователя {notification.user_id} не найден.")
                continue

            if employee.telegram_chat_id:
                exists = await sync_to_async(
                    TelegramUser.objects.filter(chat_id=employee.telegram_chat_id).exists
                )()
                if exists:
                    try:
                        await bot.send_message(
                            chat_id=employee.telegram_chat_id,
                            text=notification.message
                        )
                        logger.info(
                            f"Уведомление отправлено для пользователя {notification.user_id} на чат {employee.telegram_chat_id}"
                        )
                    except Exception as e:
                        logger.error(
                            f"Ошибка отправки уведомления для пользователя {notification.user_id} с chat_id {employee.telegram_chat_id}: {e}"
                        )
                else:
                    logger.info(f"TelegramUser с chat_id {employee.telegram_chat_id} не найден.")
            else:
                logger.info(f"У сотрудника {notification.user_id} нет привязанного telegram_chat_id.")

        await bot.session.close()

    # Запускаем асинхронную функцию через asyncio.run()
    asyncio.run(send_messages())
