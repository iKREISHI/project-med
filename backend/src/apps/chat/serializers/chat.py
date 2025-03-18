from rest_framework import serializers
from apps.chat.models import ChatRoom, Message
from .message import MessageSerializer


class ChatRoomSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    # Вывод участников можно настроить по-разному: здесь для простоты выводим username
    participants = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field='username'
    )

    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'room_type', 'participants', 'messages']

    def validate(self, data):
        # Если создаётся личный чат, убедимся, что передано ровно два участника
        if data.get('room_type') == 'private':
            # Ожидаем, что участники передаются через контекст или отдельное поле,
            # или же после создания комнаты их можно добавить через другой эндпоинт.
            participants = self.initial_data.get('participants', [])
            if len(participants) != 2:
                raise serializers.ValidationError("Личный чат должен содержать ровно двух участников.")
        return data