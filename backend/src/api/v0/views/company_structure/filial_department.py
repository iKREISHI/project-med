from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

from apps.company_structure.models.filial_department import FilialDepartment
from apps.company_structure.serializers.filial_department import FilialDepartmentSerializer


class FilialDepartmentViewSet(viewsets.ModelViewSet):
    """
    API для работы с подразделениями филиала.

    Поддерживаемые операции:
      - list: получение списка подразделений,
      - retrieve: получение подразделения по id,
      - create: создание нового подразделения,
      - update/partial_update: обновление подразделения,
      - destroy: удаление подразделения.

    Требуемые разрешения (DjangoModelPermissions):
      - Для просмотра: company_structure.view_filialdepartment,
      - Для создания: company_structure.add_filialdepartment,
      - Для обновления: company_structure.change_filialdepartment,
      - Для удаления: company_structure.delete_filialdepartment.
    """
    queryset = FilialDepartment.objects.all().order_by('name')
    serializer_class = FilialDepartmentSerializer
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    lookup_field = 'id'
    filter_backends = [filters.SearchFilter]  # Подключаем поиск
    search_fields = [
        'name',
        'director__last_name',
        'director__first_name',
        'director__patronymic',
    ]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
