from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.chat.models import ChatRoom, TextMessage, ImageMessage, FileMessage
from apps.chat.serializers.message import TextMessageSerializer, ImageMessageSerializer, FileMessageSerializer

User = get_user_model()


class MessageSerializerTestCase(TestCase):
    def setUp(self):
        # Создаем тестового пользователя
        self.user = User.objects.create(username='testuser', password='test@example.com')
        # Создаем чат-комнату и добавляем пользователя в участников
        self.chat_room = ChatRoom.objects.create(name="Test Chat", room_type="group")
        self.chat_room.participants.add(self.user)

        # Создаем текстовое сообщение
        self.text_message = TextMessage.objects.create(
            room=self.chat_room,
            sender=self.user,
            content="Hello world"
        )

        # Создаем сообщение с изображением
        # Для простоты в тесте передаем строку в поле image
        self.image_message = ImageMessage.objects.create(
            room=self.chat_room,
            sender=self.user,
            image="path/to/image.jpg"
        )

        # Создаем сообщение с файлом
        # Аналогично, передаем строку для поля file
        self.file_message = FileMessage.objects.create(
            room=self.chat_room,
            sender=self.user,
            file="path/to/file.pdf"
        )

    def test_text_message_serializer(self):
        serializer = TextMessageSerializer(instance=self.text_message)
        data = serializer.data

        # Проверяем, что тип сообщения равен "text"
        self.assertEqual(data.get('message_type'), 'text')
        # Проверяем содержание текстового сообщения
        self.assertEqual(data.get('content'), "Hello world")
        # Проверяем, что поле room содержит id созданной комнаты
        self.assertEqual(data.get('room'), self.chat_room.id)
        # Поле sender должно быть строковым представлением пользователя
        self.assertEqual(data.get('sender'), str(self.user))
        # Проверяем, что поле timestamp присутствует
        self.assertIn('timestamp', data)

    def test_image_message_serializer(self):
        serializer = ImageMessageSerializer(instance=self.image_message)
        data = serializer.data

        # Проверяем, что тип сообщения равен "image"
        self.assertEqual(data.get('message_type'), 'image')
        # Сравниваем с self.image_message.image.url
        self.assertEqual(data.get('image'), self.image_message.image.url)
        self.assertEqual(data.get('room'), self.chat_room.id)
        self.assertEqual(data.get('sender'), str(self.user))
        self.assertIn('timestamp', data)

    def test_file_message_serializer(self):
        serializer = FileMessageSerializer(instance=self.file_message)
        data = serializer.data

        # Проверяем, что тип сообщения равен "file"
        self.assertEqual(data.get('message_type'), 'file')
        # Сравниваем с self.file_message.file.url
        self.assertEqual(data.get('file'), self.file_message.file.url)
        self.assertEqual(data.get('room'), self.chat_room.id)
        self.assertEqual(data.get('sender'), str(self.user))
        self.assertIn('timestamp', data)
