from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.chat.models import ChatRoom, TextMessage, ImageMessage, FileMessage

User = get_user_model()


class MessageViewSetTest(APITestCase):
    def setUp(self):
        # Создаем трех пользователей
        self.user1 = User.objects.create_user(username="user1", password="pass123")
        self.user2 = User.objects.create_user(username="user2", password="pass123")
        self.user3 = User.objects.create_user(username="user3", password="pass123")

        # Создаем чат-комнату с участниками user1 и user2
        self.chat = ChatRoom.objects.create(name="Test Chat", room_type="group")
        self.chat.participants.set([self.user1, self.user2])

        # Создаем тестового клиента
        self.client = APIClient()

        # Создаем несколько сообщений в чате
        self.text_message = TextMessage.objects.create(
            room=self.chat, sender=self.user1, content="Hello from text"
        )
        self.image_message = ImageMessage.objects.create(
            room=self.chat, sender=self.user1, image="path/to/image.jpg"
        )
        self.file_message = FileMessage.objects.create(
            room=self.chat, sender=self.user1, file="path/to/file.pdf"
        )

    def test_list_messages_as_member(self):
        """
        Проверяем, что участник чата может получить список сообщений.
        """
        self.client.force_authenticate(user=self.user1)
        url = reverse('chatroom-messages-list', kwargs={'room_id': self.chat.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Проверяем, что вернулись все три сообщения
        self.assertEqual(len(response.data), 3)
        # Проверяем, что среди сообщений присутствуют разные типы
        message_types = {msg["message_type"] for msg in response.data}
        self.assertIn("text", message_types)
        self.assertIn("image", message_types)
        self.assertIn("file", message_types)

    def test_list_messages_as_non_member(self):
        """
        Пользователь, не являющийся участником чата, не должен видеть сообщения.
        Ожидается ответ 403 Forbidden.
        """
        self.client.force_authenticate(user=self.user3)
        url = reverse('chatroom-messages-list', kwargs={'room_id': self.chat.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_text_message_valid(self):
        """
        Проверяем создание текстового сообщения.
        """
        self.client.force_authenticate(user=self.user1)
        url = reverse('chatroom-messages-list', kwargs={'room_id': self.chat.id})
        payload = {
            "message_type": "text",
            "content": "New text message"
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data.get("message_type"), "text")
        self.assertEqual(response.data.get("content"), "New text message")
        self.assertEqual(response.data.get("room"), self.chat.id)

    def test_create_invalid_message_type(self):
        """
        Если передан неверный тип сообщения, должен вернуться ответ 400.
        """
        self.client.force_authenticate(user=self.user1)
        url = reverse('chatroom-messages-list', kwargs={'room_id': self.chat.id})
        payload = {
            "message_type": "invalid",
            "content": "Test"
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Неверный тип сообщения", response.data.get("detail", ""))

    def test_destroy_message_by_sender(self):
        """
        Проверяем, что отправитель может удалить своё сообщение.
        """
        self.client.force_authenticate(user=self.user1)
        # Создаем новое текстовое сообщение для удаления
        msg = TextMessage.objects.create(room=self.chat, sender=self.user1, content="Delete me")
        url = reverse('chatroom-messages-detail', kwargs={'room_id': self.chat.id, 'pk': msg.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(TextMessage.DoesNotExist):
            TextMessage.objects.get(pk=msg.id)

    def test_destroy_message_by_non_sender(self):
        """
        Пользователь, не являющийся отправителем, не может удалить сообщение.
        """
        self.client.force_authenticate(user=self.user2)
        msg = TextMessage.objects.create(room=self.chat, sender=self.user1, content="Can't delete this")
        url = reverse('chatroom-messages-detail', kwargs={'room_id': self.chat.id, 'pk': msg.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_destroy_message_not_found(self):
        """
        Если сообщение не найдено, возвращается 404.
        """
        self.client.force_authenticate(user=self.user1)
        url = reverse('chatroom-messages-detail', kwargs={'room_id': self.chat.id, 'pk': 9999})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
