from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions, status, serializers
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view, inline_serializer

from apps.staffing.models import Employee
from apps.users.serializers.registration import RegistrationModelSerializer

User = get_user_model()


@extend_schema_view(
    create=extend_schema(
        summary="Регистрация сотрудника",
        description="Регистрация нового сотрудника. Данный эндпоинт доступен только для администратора.",
        request=inline_serializer(
            name="RegistrationInput",
            fields={
                "first_name": serializers.CharField(help_text="Имя сотрудника"),
                "last_name": serializers.CharField(help_text="Фамилия сотрудника"),
                "patronymic": serializers.CharField(help_text="Отчество сотрудника"),
                "is_django_user": serializers.BooleanField(
                    help_text="Определяет, может ли пользователь заходить в систему"),
                "gender": serializers.ChoiceField(
                    choices=[("M", "Мужской"), ("F", "Женский")],
                    help_text="Пол сотрудника"
                ),
                "date_of_birth": serializers.DateField(help_text="Дата рождения сотрудника"),
                "snils": serializers.CharField(help_text="СНИЛС сотрудника"),
                "inn": serializers.CharField(help_text="ИНН сотрудника"),
                "registration_address": serializers.CharField(help_text="Адрес регистрации сотрудника"),
                "actual_address": serializers.CharField(help_text="Фактический адрес сотрудника"),
                "email": serializers.EmailField(help_text="Email сотрудника"),
                "phone": serializers.CharField(help_text="Номер телефона сотрудника"),
                "department": serializers.IntegerField(help_text="ID отдела филиала"),
                "position": serializers.IntegerField(help_text="ID должности сотрудника"),
                "short_description": serializers.CharField(help_text="Краткое описание сотрудника"),
            }
        ),
        responses={
            201: inline_serializer(
                name="RegistrationOutput",
                fields={
                    "first_name": serializers.CharField(),
                    "last_name": serializers.CharField(),
                    "patronymic": serializers.CharField(),
                    "gender": serializers.ChoiceField(choices=[("M", "Мужской"), ("F", "Женский")]),
                    "date_of_birth": serializers.DateField(),
                    "snils": serializers.CharField(),
                    "inn": serializers.CharField(),
                    "registration_address": serializers.CharField(),
                    "actual_address": serializers.CharField(),
                    "email": serializers.EmailField(),
                    "phone": serializers.CharField(),
                    "department": serializers.IntegerField(),
                    "position": serializers.IntegerField(),
                    "short_description": serializers.CharField(),
                    "user": inline_serializer(
                        name="UserCredentials",
                        fields={
                            "username": serializers.CharField(),
                            "password": serializers.CharField(),
                        }
                    )
                }
            )
        }
    )
)
class RegistrationViewSet(viewsets.ModelViewSet):
    http_method_names = ['post']  # Разрешаем только создание
    permission_classes = [permissions.IsAdminUser]  # Только администратор имеет доступ к данному API
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
