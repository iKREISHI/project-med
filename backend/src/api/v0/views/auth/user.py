from django.contrib.auth import login, get_user_model
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from apps.users.serializers.user import UserSerializer
from django.utils.translation import gettext_lazy as _
from django.db.models import Q

User = get_user_model()


class CurrentUserViewSet(viewsets.ViewSet):
    http_method_names = ['get']
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def list(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)