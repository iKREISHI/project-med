from itertools import chain
from operator import attrgetter
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status, permissions
from apps.chat.models import ChatRoom, TextMessage, ImageMessage, FileMessage
from apps.chat.serializers import (
    TextMessageSerializer, ImageMessageSerializer,
    FileMessageSerializer, PolymorphicMessageSerializer
)
from ..permissions import IsChatMember


class MessageViewSet(viewsets.ViewSet):
    """
    ViewSet для работы с сообщениями в чат-комнате.
    URL должен содержать параметр room_id, например:
    /api/chatrooms/<room_id>/messages/
    Для детальных операций (удаление) ожидается URL вида:
    /api/chatrooms/<room_id>/messages/<pk>/
    """

    permission_classes = [permissions.IsAuthenticated, IsChatMember]

    def get_room(self):
        room_id = self.kwargs.get("room_id")
        try:
            room = ChatRoom.objects.get(id=room_id)
        except ChatRoom.DoesNotExist:
            return None, Response({"detail": "Комната не найдена."}, status=status.HTTP_404_NOT_FOUND)
        if self.request.user not in room.participants.all():
            return None, Response({"detail": "Доступ запрещён. Вы не являетесь участником чата."},
                                 status=status.HTTP_403_FORBIDDEN)
        return room, None

    def list(self, request, room_id=None):
        room, error_response = self.get_room()
        if error_response:
            return error_response

        text_messages = TextMessage.objects.filter(room=room)
        image_messages = ImageMessage.objects.filter(room=room)
        file_messages = FileMessage.objects.filter(room=room)

        all_messages = list(chain(text_messages, image_messages, file_messages))
        all_messages = sorted(all_messages, key=attrgetter('timestamp'))
        serializer = PolymorphicMessageSerializer(all_messages, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, room_id=None):
        room, error_response = self.get_room()
        if error_response:
            return error_response

        message_type = request.data.get("message_type", "text")
        data = request.data.copy()
        data['room'] = room.id

        if message_type == "text":
            serializer_class = TextMessageSerializer
        elif message_type == "image":
            serializer_class = ImageMessageSerializer
        elif message_type == "file":
            serializer_class = FileMessageSerializer
        else:
            return Response({"detail": "Неверный тип сообщения."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = serializer_class(data=data, context={'request': request})
        if serializer.is_valid():
            message = serializer.save(sender=request.user)
            output_serializer = serializer_class(message, context={'request': request})
            return Response(output_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, room_id=None, pk=None):
        room, error_response = self.get_room()
        if error_response:
            return error_response

        # Ищем сообщение среди всех типов
        message = None
        try:
            message = TextMessage.objects.get(pk=pk, room=room)
        except TextMessage.DoesNotExist:
            try:
                message = ImageMessage.objects.get(pk=pk, room=room)
            except ImageMessage.DoesNotExist:
                try:
                    message = FileMessage.objects.get(pk=pk, room=room)
                except FileMessage.DoesNotExist:
                    return Response({"detail": "Сообщение не найдено."}, status=status.HTTP_404_NOT_FOUND)

        # Проверка прав: удалять сообщение может только отправитель
        if message.sender != request.user:
            return Response({"detail": "Доступ запрещён. Вы не являетесь отправителем этого сообщения."},
                            status=status.HTTP_403_FORBIDDEN)

        message.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)