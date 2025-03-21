from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from apps.staffing.models import ReceptionTime
from apps.staffing.serializers import ReceptionTimeSerializer


class ReceptionTimePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ReceptionTimeViewSet(viewsets.ModelViewSet):
    """
    API для работы с временем приема.

    Поддерживаются операции:
      - list: получение списка записей времени приема
        (требуется permission "reception_time.view_receptiontime"),
      - retrieve: получение записи по id
        (требуется permission "reception_time.view_receptiontime"),
      - create: создание новой записи
        (требуется permission "reception_time.add_receptiontime"),
      - update/partial_update: обновление записи
        (требуется permission "reception_time.change_receptiontime"),
      - destroy: удаление записи
        (требуется permission "reception_time.delete_receptiontime").
    """
    queryset = ReceptionTime.objects.all().order_by('reception_day', 'start_time')
    serializer_class = ReceptionTimeSerializer
    pagination_class = ReceptionTimePagination
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    lookup_field = 'id'

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
