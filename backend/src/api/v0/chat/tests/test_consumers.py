import json
import base64
import asyncio
from asgiref.sync import async_to_sync
from channels.testing import WebsocketCommunicator
from channels.routing import URLRouter
from django.test import TransactionTestCase
from django.urls import path
from ..consumers import ChatConsumer
from apps.chat.models import ChatRoom
from apps.users.models import User

# Определяем тестовое ASGI-приложение с маршрутом для ChatConsumer
application = URLRouter([
    path("ws/chat/<int:room_id>/", ChatConsumer.as_asgi()),
])


class ChatConsumerTest(TransactionTestCase):
    def setUp(self):
        # Создаем и устанавливаем новый event loop
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
        # Создаем тестового пользователя и чат-комнату
        self.user = User.objects.create_user(username="testuser", password="pass123")
        self.chat = ChatRoom.objects.create(name="Test Chat", room_type="group")
        self.chat.participants.add(self.user)
        self.url = f"/ws/chat/{self.chat.id}/"

    def tearDown(self):
        self.loop.close()

    def test_text_message(self):
        async def inner():
            communicator = WebsocketCommunicator(application, self.url)
            # Устанавливаем аутентификацию
            communicator.scope["user"] = self.user
            connected, _ = await communicator.connect()
            self.assertTrue(connected)

            # Отправляем текстовое сообщение
            payload = {"message_type": "text", "content": "Hello world"}
            await communicator.send_json_to(payload)
            response = await communicator.receive_json_from()
            self.assertEqual(response.get("message_type"), "text")
            self.assertEqual(response.get("content"), "Hello world")
            self.assertEqual(response.get("room"), self.chat.id)
            self.assertIn("sender", response)
            self.assertIn("time", response)
            await communicator.disconnect()
        self.loop.run_until_complete(inner())

    def test_invalid_message_type(self):
        async def inner():
            communicator = WebsocketCommunicator(application, self.url)
            communicator.scope["user"] = self.user
            connected, _ = await communicator.connect()
            self.assertTrue(connected)

            payload = {"message_type": "invalid", "content": "Should error"}
            await communicator.send_json_to(payload)
            response = await communicator.receive_json_from()
            self.assertIn("error", response)
            self.assertEqual(response["error"], "Неверный тип сообщения")
            await communicator.disconnect()
        self.loop.run_until_complete(inner())

    def test_multiple_images(self):
        async def inner():
            communicator = WebsocketCommunicator(application, self.url)
            communicator.scope["user"] = self.user
            connected, _ = await communicator.connect()
            self.assertTrue(connected)

            dummy_image = "data:image/jpeg;base64," + base64.b64encode(b"fakeimagedata").decode("utf-8")
            payload = {
                "message_type": "image",
                "images": [dummy_image, dummy_image],
                "image_extension": "jpg"
            }
            await communicator.send_json_to(payload)
            responses = []
            # Ожидаем, что при отправке массива изображений вернется два сообщения
            for _ in range(2):
                resp = await communicator.receive_json_from()
                responses.append(resp)
            self.assertEqual(len(responses), 2)
            for resp in responses:
                self.assertEqual(resp.get("message_type"), "image")
                self.assertIn("image", resp)
                self.assertEqual(resp.get("room"), self.chat.id)
                self.assertIn("sender", resp)
                self.assertIn("time", resp)
            await communicator.disconnect()
        self.loop.run_until_complete(inner())

    def test_file_message(self):
        async def inner():
            communicator = WebsocketCommunicator(application, self.url)
            communicator.scope["user"] = self.user
            connected, _ = await communicator.connect()
            self.assertTrue(connected)

            dummy_file = "data:application/pdf;base64," + base64.b64encode(b"fakefiledata").decode("utf-8")
            payload = {"message_type": "file", "file_data": dummy_file, "file_extension": "pdf"}
            await communicator.send_json_to(payload)
            response = await communicator.receive_json_from()
            self.assertEqual(response.get("message_type"), "file")
            self.assertIn("file", response)
            self.assertEqual(response.get("room"), self.chat.id)
            self.assertIn("sender", response)
            self.assertIn("time", response)
            await communicator.disconnect()
        self.loop.run_until_complete(inner())
