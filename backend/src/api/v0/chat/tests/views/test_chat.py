from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.chat.models import ChatRoom

User = get_user_model()

class ChatRoomViewSetTest(APITestCase):
    def setUp(self):
        # Создаем трех пользователей
        self.user1 = User.objects.create_user(username="user1", password="pass123")
        self.user2 = User.objects.create_user(username="user2", password="pass123")
        self.user3 = User.objects.create_user(username="user3", password="pass123")

        # Создаем две чат-комнаты:
        # chat1: участники user1 и user2
        self.chat1 = ChatRoom.objects.create(name="Chat One", room_type="group")
        self.chat1.participants.set([self.user1, self.user2])

        # chat2: участники user2 и user3
        self.chat2 = ChatRoom.objects.create(name="Chat Two", room_type="group")
        self.chat2.participants.set([self.user2, self.user3])

        self.client = APIClient()

    def test_list_chatrooms_for_user1(self):
        """
        Пользователь user1 должен видеть только те чаты, где он участвует (т.е. chat1).
        """
        self.client.force_authenticate(user=self.user1)
        url = reverse('rooms-list')  # убедитесь, что router зарегистровал ChatRoomViewSet с basename "rooms"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # user1 участвует только в chat1
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.chat1.id)

    def test_list_chatrooms_for_user2(self):
        """
        Пользователь user2 участвует в обоих чатах.
        """
        self.client.force_authenticate(user=self.user2)
        url = reverse('rooms-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        returned_ids = {chat['id'] for chat in response.data}
        self.assertIn(self.chat1.id, returned_ids)
        self.assertIn(self.chat2.id, returned_ids)

    def test_retrieve_chatroom_member(self):
        """
        Участник чата может получить детали чата.
        """
        self.client.force_authenticate(user=self.user1)
        url = reverse('rooms-detail', kwargs={'pk': self.chat1.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.chat1.id)

    def test_retrieve_chatroom_not_member(self):
        """
        Пользователь, не являющийся участником чата, не может получить его детали.
        Ожидается статус 403 Forbidden.
        """
        self.client.force_authenticate(user=self.user1)
        url = reverse('rooms-detail', kwargs={'pk': self.chat2.id})
        response = self.client.get(url)
        print(response)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_group_chat(self):
        """
        Проверяем создание группового чата с передачей participant_ids.
        """
        self.client.force_authenticate(user=self.user1)
        url = reverse('rooms-list')
        payload = {
            "name": "New Group Chat",
            "room_type": "group",
            "participant_ids": [self.user1.id, self.user3.id]
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        chat_id = response.data['id']
        chat = ChatRoom.objects.get(id=chat_id)
        self.assertEqual(chat.name, "New Group Chat")
        self.assertEqual(chat.room_type, "group")
        self.assertEqual(chat.participants.count(), 2)
        self.assertIn(self.user1, chat.participants.all())
        self.assertIn(self.user3, chat.participants.all())

    def test_create_private_chat_invalid(self):
        """
        Создание личного чата с неверным количеством участников должно возвращать ошибку.
        """
        self.client.force_authenticate(user=self.user1)
        url = reverse('rooms-list')
        payload = {
            "room_type": "private",
            "participant_ids": [self.user1.id]  # недостаточно участников для личного чата
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Личный чат должен содержать ровно двух участников", str(response.data))

    def test_create_private_chat_valid(self):
        """
        Успешное создание личного чата с ровно двумя участниками.
        """
        self.client.force_authenticate(user=self.user1)  # Используем force_authenticate
        url = reverse('rooms-list')
        payload = {
            "room_type": "private",
            "participant_ids": [self.user1.id, self.user2.id]
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        chat = ChatRoom.objects.get(id=response.data['id'])
        self.assertEqual(chat.room_type, "private")
        self.assertEqual(chat.participants.count(), 2)
