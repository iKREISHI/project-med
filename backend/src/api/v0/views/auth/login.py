from django.contrib.auth import login, get_user_model
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from apps.users.serializers.login import LoginSerializer
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class LoginViewSet(viewsets.ViewSet):
    http_method_names = ['post']
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=LoginSerializer,
        responses={
            200: {
                "type": "object",
                "properties": {
                    "detail": {"type": "string"},
                    "user_id": {"type": "integer"},
                    "position_id": {"type": "integer"},
                    "position": {"type": "string"},
                },
                "example": {
                    "detail": "Успешный вход",
                    "user_id": 1,
                    "position_id": 2,
                    "position": "Менеджер"
                },
            },
            400: {
                "type": "object",
                "properties": {
                    "detail": {"type": "string"},
                },
                "example": {
                    "detail": "Вы уже авторизованы"
                },
            },
        }
    )
    def create(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return Response({'detail': _('Вы уже авторизованы')}, status=status.HTTP_400_BAD_REQUEST)

        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)

            return Response({
                'detail': _('Успешный вход'),
                'user_id': user.id,
                'position_id': user.employee_profile.position.id,
                'position': user.employee_profile.position.name,
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)