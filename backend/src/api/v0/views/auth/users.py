from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.authentication import BasicAuthentication
from apps.users.services import GetUserService
from apps.users.models import User
from apps.users.serializers import UserSerializer


class Pagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class UsersViewSet(viewsets.ModelViewSet):
    """
        API для работы с пациентами с поддержкой пагинации.
        Поддерживаются операции:
          — list: получение списка пользователей с пагинацией,
          — retrieve: получение пользователя по ID,
          — create: создание нового пациента,
          — update / partial_update: обновление пациента,
          — destroy: удаление пациента.
        """
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]