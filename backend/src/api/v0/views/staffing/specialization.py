from ..abstract.search_view import CustomPagination
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from apps.staffing.models import Specialization
from apps.staffing.serializers import SpecializationSerializer


class SpecializationViewSet(viewsets.ModelViewSet):
    """
    API для работы с специализациями.
    Поддерживаются операции:
        - list: получение списка должностей (требуется permission "specialization.view_specialization"),
        - retrieve: получение должности по id (требуется permission "specialization.view_specialization"),
        - create: создание новой должности (требуется permission "specialization.add_specialization"),
        - update/partial_update: обновление должности (требуется specialization "staffing.change_specialization"),
        - destroy: удаление должности (требуется permission "specialization.delete_specialization").
    """
    queryset = Specialization.objects.all().order_by('id')
    serializer_class = SpecializationSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    lookup_field = 'id'

