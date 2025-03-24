import datetime
from itertools import chain

from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model

from apps.chat.models import ChatRoom, TextMessage, ImageMessage, FileMessage
from apps.chat.serializers import ChatRoomSerializer

User = get_user_model()


class ChatRoomSerializerTest(TestCase):
    def setUp(self):
        # Создаем трех пользователей для тестов
        self.user1 = User.objects.create(username="user1", password="user1@example.com")
        self.user2 = User.objects.create(username="user2", password="user2@example.com")
        self.user3 = User.objects.create(username="user3", password="user3@example.com")

        # Создаем чат-комнату (групповой) и добавляем двух участников
        self.chat_room = ChatRoom.objects.create(name="Test Chat", room_type="group")
        self.chat_room.participants.set([self.user1, self.user2])

        now = timezone.now()
        # Создаем текстовое сообщение
        self.text_msg = TextMessage.objects.create(
            room=self.chat_room,
            sender=self.user1,
            content="Hello"
        )
        # Создаем сообщение с изображением (для простоты передаем строку в поле image)
        self.image_msg = ImageMessage.objects.create(
            room=self.chat_room,
            sender=self.user2,
            image="images/dummy.jpg"
        )
        # Создаем сообщение с файлом (аналогично)
        self.file_msg = FileMessage.objects.create(
            room=self.chat_room,
            sender=self.user1,
            file="files/dummy.pdf"
        )
        # Обновляем временные метки для явного порядка (от старого к новому)
        TextMessage.objects.filter(pk=self.text_msg.pk).update(timestamp=now - datetime.timedelta(minutes=5))
        ImageMessage.objects.filter(pk=self.image_msg.pk).update(timestamp=now - datetime.timedelta(minutes=2))
        FileMessage.objects.filter(pk=self.file_msg.pk).update(timestamp=now - datetime.timedelta(minutes=1))
        # Обновляем объекты из базы
        self.text_msg.refresh_from_db()
        self.image_msg.refresh_from_db()
        self.file_msg.refresh_from_db()


    def test_create_group_chat(self):
        """
        Проверяет создание группового чата с помощью поля participant_ids.
        """
        serializer_data = {
            "name": "New Group Chat",
            "room_type": "group",
            "participant_ids": [self.user1.id, self.user2.id, self.user3.id]
        }
        serializer = ChatRoomSerializer(data=serializer_data, context={'request': None})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        chat_room = serializer.save()
        self.assertEqual(chat_room.name, "New Group Chat")
        self.assertEqual(chat_room.room_type, "group")
        self.assertEqual(chat_room.participants.count(), 3)

    def test_create_private_chat_invalid(self):
        """
        Проверяет, что создание личного чата с неверным количеством участников (например, 1 участник)
        вызывает ошибку валидации.
        """
        serializer_data = {
            "room_type": "private",
            "participant_ids": [self.user1.id]
        }
        serializer = ChatRoomSerializer(data=serializer_data, context={'request': None})
        self.assertFalse(serializer.is_valid())
        self.assertIn("Личный чат должен содержать ровно двух участников", str(serializer.errors))

    def test_create_private_chat_valid(self):
        """
        Проверяет успешное создание личного чата с ровно двумя участниками.
        """
        serializer_data = {
            "room_type": "private",
            "participant_ids": [self.user1.id, self.user2.id]
        }
        serializer = ChatRoomSerializer(data=serializer_data, context={'request': None})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        chat_room = serializer.save()
        self.assertEqual(chat_room.room_type, "private")
        self.assertEqual(chat_room.participants.count(), 2)
