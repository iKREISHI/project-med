from rest_framework import viewsets, permissions
from apps.chat.models import ChatRoom
from apps.chat.serializers import ChatRoomSerializer
from rest_framework.exceptions import PermissionDenied


class ChatRoomViewSet(viewsets.ModelViewSet):
    """
    Эндпоинт для работы с чат-комнатами. Список комнат ограничивается только теми,
    в которых пользователь является участником. При доступе к деталям также проверяется,
    что пользователь входит в список участников.
    """
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.action == 'list':
            user = self.request.user
            return ChatRoom.objects.filter(participants=user)
        return ChatRoom.objects.all()

    def get_object(self):
        obj = super().get_object()
        if self.request.user not in obj.participants.all():
            raise PermissionDenied("Доступ запрещён. Вы не являетесь участником чата.")
        return obj