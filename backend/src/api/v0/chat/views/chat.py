# views.py
from rest_framework import viewsets, permissions
from apps.chat.models import ChatRoom
from apps.chat.serializers import ChatRoomSerializer
from ..permissions import IsChatMember


class ChatRoomViewSet(viewsets.ModelViewSet):
    """
    Эндпоинт для работы с чат-комнатами. Список комнат ограничивается только теми,
    в которых пользователь является участником. При доступе к деталям также проверяется,
    что пользователь входит в список участников.
    """
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated, IsChatMember]

    def get_queryset(self):
        # Возвращаем только те комнаты, в которых пользователь является участником
        user = self.request.user
        return ChatRoom.objects.filter(participants=user)
