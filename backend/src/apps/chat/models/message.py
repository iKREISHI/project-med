from django.db import models
from .chat import ChatRoom
from django.utils.translation import gettext_lazy as _


class Message(models.Model):
    room = models.ForeignKey(
        ChatRoom,
        related_name='messages',
        on_delete=models.CASCADE,
        verbose_name=_('Чат')

    )
    sender = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        verbose_name=_('Отправитель')
    )
    content = models.TextField(
        verbose_name=_('Текст сообщение')
    )
    timestamp = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Время отправки')
    )

    def __str__(self):
        return f"{self.sender.username}: {self.content[:20]}"
