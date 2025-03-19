from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from apps.chat.models import ChatRoom

User = get_user_model()


class ChatRoomModelTest(TestCase):
    def setUp(self):

        self.user1 = User.objects.create(username='user1', password='user1@example.com')
        self.user2 = User.objects.create(username='user2', password='user2@example.com')
        self.user3 = User.objects.create(username='user3', password='user3@example.com')

    def test_valid_private_chat(self):
        """Личный чат с ровно двумя участниками должен быть валидным."""
        chat_room = ChatRoom.objects.create(room_type='private')
        chat_room.participants.add(self.user1, self.user2)
        try:
            chat_room.full_clean()
        except ValidationError as e:
            self.fail(f"full_clean вызвал ValidationError неожиданно: {e}")

    def test_private_chat_with_one_participant_invalid(self):
        """Личный чат с одним участником должен выдавать ошибку валидации."""
        chat_room = ChatRoom.objects.create(room_type='private')
        chat_room.participants.add(self.user1)
        with self.assertRaises(ValidationError):
            chat_room.full_clean()

    def test_private_chat_with_three_participants_invalid(self):
        """Личный чат с тремя участниками должен выдавать ошибку валидации."""
        chat_room = ChatRoom.objects.create(room_type='private')
        chat_room.participants.add(self.user1, self.user2, self.user3)
        with self.assertRaises(ValidationError):
            chat_room.full_clean()

    def test_private_chat_str(self):
        """Проверка строкового представления личного чата."""
        chat_room = ChatRoom.objects.create(room_type='private')
        chat_room.participants.add(self.user1, self.user2)
        chat_str = str(chat_room)
        self.assertTrue(chat_str.startswith("Личный чат:"), "Строковое представление должно начинаться с 'Личный чат:'")
        self.assertIn(self.user1.username, chat_str)
        self.assertIn(self.user2.username, chat_str)

    def test_group_chat_str_with_name(self):
        """Проверка строкового представления группового чата с заданным именем."""
        chat_room = ChatRoom.objects.create(room_type='group', name='Group Chat')
        chat_room.participants.add(self.user1, self.user2, self.user3)
        self.assertEqual(str(chat_room), 'Group Chat')

    def test_group_chat_str_without_name(self):
        """Проверка строкового представления группового чата без заданного имени."""
        chat_room = ChatRoom.objects.create(room_type='group')
        chat_room.participants.add(self.user1, self.user2)
        self.assertEqual(str(chat_room), 'Групповой чат')
