from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.chat.models import Message
from apps.chat.models import ChatRoom  # Предполагается, что ChatRoom находится в apps/chat/chat.py

User = get_user_model()


class MessageModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='testuser', password='test@example.com')
        self.chat_room = ChatRoom.objects.create(room_type='group', name='Test Group Chat')
        self.chat_room.participants.add(self.user)
        self.message = Message.objects.create(
            room=self.chat_room,
            sender=self.user,
            content="This is a test message to verify functionality."
        )

    def test_message_creation(self):
        """Проверяет, что сообщение успешно сохраняется в базе данных и содержит корректные данные."""
        self.assertEqual(Message.objects.count(), 1)
        msg = Message.objects.first()
        self.assertEqual(msg.room, self.chat_room)
        self.assertEqual(msg.sender, self.user)
        self.assertEqual(msg.content, "This is a test message to verify functionality.")
        # Проверяем, что timestamp установлен (auto_now=True)
        self.assertIsNotNone(msg.timestamp)
        self.assertLessEqual(msg.timestamp, timezone.now())

    def test_message_str(self):
        """Проверяет корректность строкового представления сообщения (__str__)."""
        expected_str = f"{self.user.username}: {self.message.content[:20]}"
        self.assertEqual(str(self.message), expected_str)
