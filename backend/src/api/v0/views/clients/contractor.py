from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from apps.clients.models.contractor import Contractor
from apps.clients.serializers.contractor import ContractorSerializer


class ContractorPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ContractorViewSet(viewsets.ModelViewSet):
    """
    API для работы с контрагентами.

    Поддерживаются операции:
      - list: получение списка контрагентов (требуется permission "clients.view_contractor"),
      - retrieve: получение контрагента по id (требуется permission "clients.view_contractor"),
      - create: создание нового контрагента (требуется permission "clients.add_contractor"),
      - update/partial_update: обновление контрагента (требуется permission "clients.change_contractor"),
      - destroy: удаление контрагента (требуется permission "clients.delete_contractor").
    """
    queryset = Contractor.objects.all().order_by('full_name')
    serializer_class = ContractorSerializer
    pagination_class = ContractorPagination
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

    def retrieve(self, request, *args, **kwargs):
        contractor = self.get_object()
        serializer = self.get_serializer(contractor)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contractor = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        contractor = self.get_object()
        serializer = self.get_serializer(contractor, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        contractor = self.get_object()
        contractor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
