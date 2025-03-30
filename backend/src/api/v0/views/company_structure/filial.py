from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from apps.company_structure.models.filial import Filial
from apps.company_structure.serializers import FilialSerializer


class FilialPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class FilialViewSet(viewsets.ModelViewSet):
    """
    API для работы с филиалами.

    Поддерживаются операции:
      - list: получение списка филиалов (требуется permission "company_structure.view_filial"),
      - retrieve: получение филиала по id (требуется permission "company_structure.view_filial"),
      - create: создание нового филиала (требуется permission "company_structure.add_filial"),
      - update/partial_update: обновление филиала (требуется permission "company_structure.change_filial"),
      - destroy: удаление филиала (требуется permission "company_structure.delete_filial").
    """
    queryset = Filial.objects.all().order_by('city', 'street', 'house')
    serializer_class = FilialSerializer
    pagination_class = FilialPagination
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
        filial = self.get_object()
        serializer = self.get_serializer(filial)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        filial = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        filial = self.get_object()
        serializer = self.get_serializer(filial, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        updated_filial = serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        filial = self.get_object()
        filial.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
