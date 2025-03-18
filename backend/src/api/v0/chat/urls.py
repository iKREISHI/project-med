from rest_framework.routers import DefaultRouter
from api.v0.chat.views import ChatRoomViewSet, MessageViewSet


router = DefaultRouter()
router.register(r'rooms', ChatRoomViewSet)
router.register(r'messages', MessageViewSet)

urlpatterns = router.urls