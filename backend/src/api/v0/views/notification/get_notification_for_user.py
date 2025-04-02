from rest_framework import viewsets, permissions
from rest_framework.pagination import PageNumberPagination
from apps.notification.models import Notification
from apps.notification.serializers import NotificationSerializer
from apps.notification.service import NotificationService


class NotificationPagination(PageNumberPagination):
    page_size = 10  # Количество уведомлений на одной странице
    page_size_query_param = 'page_size'
    max_page_size = 100


class NotificationReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Эндпоинт для чтения уведомлений текущего пользователя.
    Доступен только для аутентифицированных пользователей.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = NotificationPagination

    def get_queryset(self):
        # Возвращает уведомления, связанные с текущим пользователем
        return NotificationService.list_notifications_by_user(user=self.request.user)
