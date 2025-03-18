from django.contrib.auth import get_user_model, logout
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.utils.translation import gettext_lazy as _

from apps.staffing.models import Employee
from apps.users.serializers.registration import RegistrationModelSerializer

User = get_user_model()


class RegistrationViewSet(viewsets.ModelViewSet):
    http_method_names = ['post']
    permission_classes = [permissions.IsAdminUser]
    serializer_class = RegistrationModelSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Employee.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return Response({'detail': _('Вы уже авторизованы')}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': _('Вы успешно зарегистрировались.')},
                status=status.HTTP_201_CREATED,
            )
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )