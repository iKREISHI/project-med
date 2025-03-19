from rest_framework import serializers
from apps.chat.models import ChatRoom, TextMessage, ImageMessage, FileMessage
from django.utils.translation import gettext_lazy as _
from .message import TextMessageSerializer, ImageMessageSerializer, FileMessageSerializer


class PolymorphicMessageSerializer(serializers.Serializer):
    def to_representation(self, instance):
        if isinstance(instance, TextMessage):
            serializer = TextMessageSerializer(instance, context=self.context)
        elif isinstance(instance, ImageMessage):
            serializer = ImageMessageSerializer(instance, context=self.context)
        elif isinstance(instance, FileMessage):
            serializer = FileMessageSerializer(instance, context=self.context)
        else:
            raise Exception(_("Неизвестный тип сообщения"))
        return serializer.data


class ChatRoomSerializer(serializers.ModelSerializer):
    messages = PolymorphicMessageSerializer(many=True, read_only=True)
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
