from rest_framework import serializers
from apps.chat.models import ChatRoom, Message
from .message import MessageSerializer
from django.utils.translation import gettext_lazy as _


class ChatRoomSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    participants = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field='id'
    )

    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'room_type', 'participants', 'messages']

    def validate(self, data):
        if data.get('room_type') == 'private':
            participants = self.initial_data.get('participants', [])
            if len(participants) != 2:
                raise serializers.ValidationError(_("Личный чат должен содержать ровно двух участников."))
        return data