from django.contrib.auth import get_user_model
from rest_framework import serializers
from apps.chat.models import ChatRoom, TextMessage, ImageMessage, FileMessage
from django.utils.translation import gettext_lazy as _
from .message import TextMessageSerializer, ImageMessageSerializer, FileMessageSerializer

User = get_user_model()


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
    participant_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'room_type', 'participants', 'participant_ids', 'messages']

    def validate(self, data):
        if data.get('room_type') == 'private':
            participants = self.initial_data.get('participant_ids', [])
            if len(participants) != 2:
                raise serializers.ValidationError(_("Личный чат должен содержать ровно двух участников."))
        return data

    def create(self, validated_data):
        participant_ids = validated_data.pop('participant_ids', [])
        chat_room = ChatRoom.objects.create(**validated_data)
        if participant_ids:
            users = User.objects.filter(id__in=participant_ids)
            chat_room.participants.set(users)
        return chat_room
