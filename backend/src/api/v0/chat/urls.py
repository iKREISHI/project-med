from rest_framework.routers import DefaultRouter
from api.v0.chat.views import ChatRoomViewSet, MessageViewSet


router = DefaultRouter()
router.register(r'chat-rooms', ChatRoomViewSet, basename='rooms')
router.register(r'chat-rooms/(?P<room_id>\d+)/messages', MessageViewSet, basename='chatroom-messages')

urlpatterns = router.urls