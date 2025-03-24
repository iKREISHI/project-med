import json
import base64
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.files.base import ContentFile
from django.utils import timezone
from apps.chat.models import ChatRoom, TextMessage, ImageMessage, FileMessage
from apps.users.models import User


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get("message_type", "text")
        current_time = timezone.now().strftime("%H:%M:%S")

        # Обработка текстового сообщения
        if message_type == "text":
            message_instance = await self.create_text_message(data)
        # Обработка изображений: если передан список, создаем отдельное сообщение для каждого
        elif message_type == "image":
            images = data.get("images")
            if images and isinstance(images, list):
                for img_data in images:
                    message_instance = await self.create_image_message({
                        "image_data": img_data,
                        "image_extension": data.get("image_extension", "jpg")
                    })
                    serialized_message = self.serialize_message(message_instance)
                    # Получаем имя сотрудника для отправителя
                    sender_name = await self.get_employee_name(self.scope["user"].pk)
                    serialized_message["sender"] = sender_name
                    serialized_message["time"] = current_time
                    await self.send_to_group(serialized_message)
                return
            else:
                message_instance = await self.create_image_message(data)
        # Обработка файлов
        elif message_type == "file":
            files = data.get("files")
            if files and isinstance(files, list):
                for file_data in files:
                    message_instance = await self.create_file_message({
                        "file_data": file_data,
                        "file_extension": data.get("file_extension", "txt")
                    })
                    serialized_message = self.serialize_message(message_instance)
                    sender_name = await self.get_employee_name(self.scope["user"].pk)
                    serialized_message["sender"] = sender_name
                    serialized_message["time"] = current_time
                    await self.send_to_group(serialized_message)
                return
            else:
                message_instance = await self.create_file_message(data)
        else:
            await self.send(text_data=json.dumps({"error": "Неверный тип сообщения"}))
            return

        serialized_message = self.serialize_message(message_instance)
        sender_name = await self.get_employee_name(self.scope["user"].pk)
        serialized_message["sender"] = sender_name
        serialized_message["time"] = current_time

        await self.send_to_group(serialized_message)

    async def send_to_group(self, message):
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "chat_message", "message": message}
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    @database_sync_to_async
    def create_text_message(self, data):
        room = ChatRoom.objects.get(id=self.room_id)
        return TextMessage.objects.create(
            room=room,
            sender=self.scope["user"],
            content=data.get("content", "")
        )

    @database_sync_to_async
    def create_image_message(self, data):
        room = ChatRoom.objects.get(id=self.room_id)
        image_data = data.get("image_data")
        image_extension = data.get("image_extension", "jpg")
        if image_data.startswith("data:"):
            header, base64_str = image_data.split(',', 1)
        else:
            base64_str = image_data
        image_file = ContentFile(
            base64.b64decode(base64_str),
            name=f"{uuid.uuid4()}.{image_extension}"
        )
        return ImageMessage.objects.create(
            room=room,
            sender=self.scope["user"],
            image=image_file
        )

    @database_sync_to_async
    def create_file_message(self, data):
        room = ChatRoom.objects.get(id=self.room_id)
        file_data = data.get("file_data")
        file_extension = data.get("file_extension", "txt")
        if file_data.startswith("data:"):
            header, base64_str = file_data.split(',', 1)
        else:
            base64_str = file_data
        file_obj = ContentFile(
            base64.b64decode(base64_str),
            name=f"{uuid.uuid4()}.{file_extension}"
        )
        return FileMessage.objects.create(
            room=room,
            sender=self.scope["user"],
            file=file_obj
        )

    def serialize_message(self, message_instance):
        if hasattr(message_instance, 'content'):
            return {
                "id": message_instance.id,
                "room": message_instance.room.id,
                "sender": str(message_instance.sender),
                "timestamp": message_instance.timestamp.isoformat(),
                "message_type": "text",
                "content": message_instance.content,
            }
        elif hasattr(message_instance, 'image'):
            return {
                "id": message_instance.id,
                "room": message_instance.room.id,
                "sender": str(message_instance.sender),
                "timestamp": message_instance.timestamp.isoformat(),
                "message_type": "image",
                "image": message_instance.image.url if message_instance.image else None,
            }
        elif hasattr(message_instance, 'file'):
            return {
                "id": message_instance.id,
                "room": message_instance.room.id,
                "sender": str(message_instance.sender),
                "timestamp": message_instance.timestamp.isoformat(),
                "message_type": "file",
                "file": message_instance.file.url if message_instance.file else None,
            }
        return {}

    @database_sync_to_async
    def get_employee_name(self, user_pk) -> str:
        user = User.objects.get(pk=user_pk)
        if hasattr(user, "employee_profile") and user.employee_profile:
            employee = user.employee_profile
            first_initial = employee.first_name[0] + '.' if employee.first_name else ''
            patronymic_initial = employee.patronymic[0] + '.' if employee.patronymic else ''
            return f"{employee.last_name} {first_initial}{patronymic_initial}"
        return user.username
