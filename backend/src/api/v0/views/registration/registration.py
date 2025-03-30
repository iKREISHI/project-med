from django.contrib.auth import get_user_model, logout
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.utils.translation import gettext_lazy as _

from apps.staffing.models import Employee
from apps.users.serializers.registration import RegistrationModelSerializer

User = get_user_model()


class RegistrationViewSet(viewsets.ModelViewSet):
    http_method_names = ['post']  # Разрешаем только создание
    permission_classes = [permissions.IsAdminUser]  # Только администратор может вызывать API
    serializer_class = RegistrationModelSerializer

    def get_queryset(self):

        if self.request.user.is_authenticated:
            return Employee.objects.filter(user=self.request.user)
        return Employee.objects.none()


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():

            employee = serializer.save()

            response_data = serializer.data

            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
