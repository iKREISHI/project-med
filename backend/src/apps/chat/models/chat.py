from django.db import models
from django.utils.translation import gettext_lazy as _


class ChatRoom(models.Model):
    ROOM_TYPE_CHOICES = (
        ('private', 'Личный'),
        ('group', 'Групповой'),
    )
    name = models.CharField(
        max_length=100,
        blank=True, null=True,
        verbose_name=_('Название чата')
    )
    room_type = models.CharField(
        max_length=10,
        choices=ROOM_TYPE_CHOICES,
        verbose_name=_('Тип чата')
    )
    participants = models.ManyToManyField(
        'users.User',
        related_name='chat_rooms',
        verbose_name=_('Участники чата')
    )

    def __str__(self):
        if self.room_type == 'private':
            usernames = [user.username for user in self.participants.all()]
            return "Личный чат: " + " & ".join(usernames)
        return self.name or "Групповой чат"

    def clean(self):
        if self.room_type == 'private' and self.participants.count() != 2:
            from django.core.exceptions import ValidationError
            raise ValidationError("Личный чат должен содержать ровно двух участников.")


