from django.db import models
from apps.users.models import users


class Notification(models.Model):
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name='Пользователь',
        null=True,
        blank=True,
    )

    message = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    STATUS_CHOICES = {
        'delivered': 'Доставлено',
        'unsent': 'Не доставлено',
        'planning': 'Планируется'
    }
    status = models.CharField(
        max_length=32,
        choices=STATUS_CHOICES.items(),
        verbose_name='Статус'
    )

    date = models.DateTimeField(
        verbose_name='Дата',
        null=True,
        blank=True
    )

    date_created = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )

    date_delivered = models.DateTimeField(
        auto_now=True,
        verbose_name='Время доставки сообщения'
    )

    class Meta:
        verbose_name = 'Уведомление'
        verbose_name_plural = 'Уведомления'


class TelegramUser(models.Model):
    chat_id = models.BigIntegerField(unique=True)
    username = models.CharField(max_length=150, blank=True, null=True)
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username or self.chat_id}"
