from rest_framework import serializers
from apps.chat.models import TextMessage, ImageMessage, FileMessage


class TextMessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField(read_only=True)
    message_type = serializers.SerializerMethodField()

    class Meta:
        model = TextMessage
        fields = ['id', 'room', 'sender', 'timestamp', 'message_type', 'content']

    def get_message_type(self, obj):
        return 'text'


class ImageMessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField(read_only=True)
    message_type = serializers.SerializerMethodField()

    class Meta:
        model = ImageMessage
        fields = ['id', 'room', 'sender', 'timestamp', 'message_type', 'image']

    def get_message_type(self, obj):
        return 'image'


class FileMessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField(read_only=True)
    message_type = serializers.SerializerMethodField()

    class Meta:
        model = FileMessage
        fields = ['id', 'room', 'sender', 'timestamp', 'message_type', 'file']

    def get_message_type(self, obj):
        return 'file'
