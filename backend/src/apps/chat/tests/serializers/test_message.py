from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.chat.models import ChatRoom, Message
from apps.chat.serializers import MessageSerializer

User = get_user_model()


class MessageSerializerTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='testuser', password='testuser@example.com')
        self.chat_room = ChatRoom.objects.create(room_type='group', name='Test Chat Room')
        self.chat_room.participants.add(self.user)
        self.message = Message.objects.create(
            room=self.chat_room,
            sender=self.user,
            content="This is a test message"
        )

    def test_serializer_fields_presence(self):
        """Проверяем, что сериализатор возвращает все необходимые поля."""
        serializer = MessageSerializer(instance=self.message)
        data = serializer.data
        self.assertIn('id', data)
        self.assertIn('room', data)
        self.assertIn('sender', data)
        self.assertIn('content', data)
        self.assertIn('timestamp', data)

    def test_serializer_output(self):
        """Проверяем корректность значений, возвращаемых сериализатором."""
        serializer = MessageSerializer(instance=self.message)
        data = serializer.data

        self.assertEqual(data['sender'], str(self.user))
        self.assertEqual(data['room'], self.chat_room.id)
        self.assertEqual(data['content'], "This is a test message")
        self.assertIsNotNone(data['timestamp'])
