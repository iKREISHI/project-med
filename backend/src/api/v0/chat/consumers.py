import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from apps.chat.models import ChatRoom, Message
from apps.users.models import User
from django.utils import timezone


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Ожидаем, что URL выглядит как /ws/chat/<room_id>/
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        # Присоединяемся к группе комнаты
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Покидаем группу комнаты
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        sender = await self.get_employee_name(self.scope["user"].pk)
        print(timezone.now().strftime("%H:%M:%S"))
        time = timezone.now().strftime("%H:%M:%S")
        # Сохраняем сообщение в базе данных
        await self.save_message(self.room_id, self.scope["user"].id, message)

        # Рассылаем сообщение всем участникам комнаты
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender,
                'time': time
            }
        )

    async def chat_message(self, event):
        # Отправляем сообщение клиенту
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender'],
            'time': event['time']
        }))

    @database_sync_to_async
    def save_message(self, room_id, user_id, message):
        try:
            room = ChatRoom.objects.get(id=room_id)
        except ChatRoom.DoesNotExist:
            print(f"Комната с id {room_id} не найдена")
            return
        user = User.objects.get(id=user_id)
        msg = Message.objects.create(room=room, sender=user, content=message)
        print(f"Сообщение сохранено: {msg}")

    @database_sync_to_async
    def get_employee_name(self, user_pk) -> str:
        employee = User.objects.get(pk=user_pk).employee_profile
        if not employee:
            return f'{User.objects.get(pk=user_pk).username}'

        return (f''
                f'{employee.last_name}'
                f' {employee.first_name[0] + '.' if employee.first_name else ''}'
                f'{employee.patronymic[0] + '.' if employee.patronymic else ''}'
                f'')
