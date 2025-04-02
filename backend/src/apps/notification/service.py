from datetime import datetime
from apps.users.models import User  # Импорт модели пользователя
from .models import Notification


class NotificationService:
    @staticmethod
    def create_notification(user, message, status, date_notification):
        """
        Создаёт новое уведомление.

        :param user: Объект пользователя или его идентификатор.
        :param message: Текст уведомления.
        :param status: Статус уведомления ('delivered' или 'unsent').
        :param date_notification: Время уведомления
        :return: Созданное уведомление.
        """
        notification = Notification.objects.create(
            user=user,
            message=message,
            status=status,
            date=date_notification
        )
        return notification

    @staticmethod
    def get_notification(notification_id):
        """
        Получает уведомление по его ID.

        :param notification_id: Идентификатор уведомления.
        :return: Объект уведомления или None, если не найдено.
        """
        try:
            return Notification.objects.get(pk=notification_id)
        except Notification.DoesNotExist:
            return None

    @staticmethod
    def update_notification(notification_id, **kwargs):
        """
        Обновляет уведомление с указанными параметрами.

        :param notification_id: Идентификатор уведомления.
        :param kwargs: Параметры для обновления (например, message, status).
        :return: Обновлённое уведомление или None, если уведомление не найдено.
        """
        notification = NotificationService.get_notification(notification_id)
        if notification:
            for key, value in kwargs.items():
                if hasattr(notification, key):
                    setattr(notification, key, value)
            notification.save()
            return notification
        return None

    @staticmethod
    def delete_notification(notification_id):
        """
        Удаляет уведомление по его ID.

        :param notification_id: Идентификатор уведомления.
        :return: True, если уведомление было удалено, иначе False.
        """
        notification = NotificationService.get_notification(notification_id)
        if notification:
            notification.delete()
            return True
        return False

    @staticmethod
    def list_notifications_by_delivery_date(delivery_date):
        """
        Получает список уведомлений по дню доставки.

        :param delivery_date: Дата доставки в формате datetime.date или строка 'YYYY-MM-DD'.
        :return: QuerySet уведомлений, доставленных в указанный день.
        """
        if isinstance(delivery_date, str):
            delivery_date = datetime.strptime(delivery_date, '%Y-%m-%d').date()
        return Notification.objects.filter(date_delivered__date=delivery_date)

    @staticmethod
    def list_notifications_by_delivery_date_and_user(delivery_date, user):
        """
        Получает список уведомлений по дню доставки для указанного пользователя.

        :param delivery_date: Дата доставки в формате datetime.date или строка 'YYYY-MM-DD'.
        :param user: Объект пользователя или его идентификатор.
        :return: QuerySet уведомлений для пользователя в указанный день.
        """
        if isinstance(delivery_date, str):
            delivery_date = datetime.strptime(delivery_date, '%Y-%m-%d').date()
        if not isinstance(user, User):
            user = User.objects.get(pk=user)
        return Notification.objects.filter(user=user, date_delivered__date=delivery_date)

    @staticmethod
    def list_notifications_by_user(user):
        """
        Получает все уведомления для указанного пользователя.

        :param user: Объект пользователя или его идентификатор.
        :return: QuerySet уведомлений для данного пользователя.
        """
        if not isinstance(user, User):
            user = User.objects.get(pk=user)
        return Notification.objects.filter(user=user)
