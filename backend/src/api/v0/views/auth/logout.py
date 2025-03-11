from django.contrib.auth import get_user_model, logout
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.utils.translation import gettext_lazy as _


User = get_user_model()


class LogoutViewSet(viewsets.ViewSet):
    http_method_names = ['post']
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        if request.user.is_authenticated:
            logout(request)
            return Response(status=status.HTTP_200_OK)

        return Response({'non_field_errors': _('Вы уже вышли из системы')}, status=status.HTTP_400_BAD_REQUEST)