from django.db import models
from .chat import ChatRoom
from django.utils.translation import gettext_lazy as _


class BaseMessage(models.Model):
    room = models.ForeignKey(
        ChatRoom,
        related_name="%(class)s_messages",
        on_delete=models.CASCADE
    )
    sender = models.ForeignKey('users.User', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class TextMessage(BaseMessage):
    content = models.TextField()

    def __str__(self):
        return f"{self.sender.username}: {self.content[:20]}"


class ImageMessage(BaseMessage):
    image = models.ImageField(upload_to='chat_images/')

    def __str__(self):
        return f"{self.sender.username}: Изображение"


class FileMessage(BaseMessage):
    file = models.FileField(upload_to='chat_files/')

    def __str__(self):
        return f"{self.sender.username}: Файл"
