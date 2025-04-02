from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from apps.registry.models.medical_card_type import MedicalCardType
from apps.registry.serializers import MedicalCardTypeSerializer


class MedicalCardTypePagination(PageNumberPagination):
    page_size = 10  # Количество элементов на странице по умолчанию
    page_size_query_param = 'page_size'  # Параметр для изменения количества элементов на странице
    max_page_size = 100  # Максимально допустимое количество элементов на странице
    ordering = 'id'


class MedicalCardTypeViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы с объектами MedicalCardType.
    Поддерживает методы: list, create, retrieve, update, partial_update, destroy.
    Добавлены права на вход и проверки Django-пермишенов на уровне модели.
    """
    queryset = MedicalCardType.objects.all()
    serializer_class = MedicalCardTypeSerializer
    pagination_class = MedicalCardTypePagination
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
