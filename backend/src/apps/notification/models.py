from django.db import models
from apps.users.models import users


class Notification(models.Model):
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name='Пользователь'
    )

    message = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    STATUS_CHOICES = {
        'delivered': 'Доставлено',
        'unsent': 'Не доставлено'
    }
    status = models.CharField(
        max_length=32,
        choices=STATUS_CHOICES.items(),
        verbose_name='Статус'
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
