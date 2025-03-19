from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.chat.models import ChatRoom
from apps.chat.serializers import ChatRoomSerializer

User = get_user_model()


class ChatRoomSerializerTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create(username='user1', password='user1@example.com')
        self.user2 = User.objects.create(username='user2', password='user2@example.com')
        self.user3 = User.objects.create(username='user3', password='user3@example.com')

    def test_valid_private_chat_serializer(self):
        """
        Личный чат должен валидироваться, если в initial_data переданы ровно 2 участника.
        """
        data = {
            "room_type": "private",
            "participants": [self.user1.id, self.user2.id]
        }
        serializer = ChatRoomSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["room_type"], "private")

    def test_invalid_private_chat_serializer_one_participant(self):
        """
        Личный чат с одним участником должен выдавать ошибку валидации.
        """
        data = {
            "room_type": "private",
            "participants": [self.user1.username]
        }
        serializer = ChatRoomSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("Личный чат должен содержать ровно двух участников.", str(serializer.errors))

    def test_invalid_private_chat_serializer_three_participants(self):
        """
        Личный чат с тремя участниками должен выдавать ошибку валидации.
        """
        data = {
            "room_type": "private",
            "participants": [self.user1.username, self.user2.username, self.user3.username]
        }
        serializer = ChatRoomSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("Личный чат должен содержать ровно двух участников.", str(serializer.errors))

    def test_valid_group_chat_serializer(self):
        """
        Для группового чата валидация проходит без проверки количества участников.
        """
        data = {
            "room_type": "group",
            "name": "Test Group Chat",
            "participants": [self.user1.username, self.user2.username, self.user3.username]
        }
        serializer = ChatRoomSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        validated_data = serializer.validated_data
        self.assertEqual(validated_data["room_type"], "group")
        self.assertEqual(validated_data.get("name"), "Test Group Chat")

    def test_serializer_output_fields(self):
        """
        Проверяем, что при сериализации экземпляра модели возвращаются все необходимые поля.
        """
        chat_room = ChatRoom.objects.create(room_type="group", name="Test Group Chat")
        chat_room.participants.set([self.user1, self.user2])
        serializer = ChatRoomSerializer(instance=chat_room)
        data = serializer.data
        self.assertIn("id", data)
        self.assertIn("name", data)
        self.assertIn("room_type", data)
        self.assertIn("participants", data)
        self.assertIn("messages", data)
        self.assertEqual(len(data["participants"]), 2)
