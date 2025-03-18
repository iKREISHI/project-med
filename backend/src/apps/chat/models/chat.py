from django.db import models


class ChatRoom(models.Model):
    ROOM_TYPE_CHOICES = (
        ('private', 'Личный'),
        ('group', 'Групповой'),
    )
    # Для группового чата можно задать имя, для личного можно оставить пустым
    name = models.CharField(max_length=100, blank=True, null=True)
    room_type = models.CharField(max_length=10, choices=ROOM_TYPE_CHOICES)
    participants = models.ManyToManyField(
        'users.User',
        related_name='chat_rooms'
    )

    def __str__(self):
        if self.room_type == 'private':
            # Формирование имени для личного чата по именам участников
            usernames = [user.username for user in self.participants.all()]
            return "Личный чат: " + " & ".join(usernames)
        return self.name or "Групповой чат"

    def clean(self):
        # Если чат личный, то участников должно быть ровно два
        if self.room_type == 'private' and self.participants.count() != 2:
            from django.core.exceptions import ValidationError
            raise ValidationError("Личный чат должен содержать ровно двух участников.")


