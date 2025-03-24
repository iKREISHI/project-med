from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from apps.staffing.models.position import Position
from apps.staffing.serializers.position import PositionSerializer
from apps.staffing.services import PositionService


class PositionPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class PositionViewSet(viewsets.ModelViewSet):
    """
    API для работы с должностями.

    Поддерживаются операции:
      - list: получение списка должностей (требуется permission "staffing.view_position"),
      - retrieve: получение должности по id (требуется permission "staffing.view_position"),
      - create: создание новой должности (требуется permission "staffing.add_position"),
      - update/partial_update: обновление должности (требуется permission "staffing.change_position"),
      - destroy: удаление должности (требуется permission "staffing.delete_position").
    """
    queryset = Position.objects.all().order_by('name')
    serializer_class = PositionSerializer
    pagination_class = PositionPagination
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    lookup_field = 'id'

    def retrieve(self, request, *args, **kwargs):
        position = self.get_object()
        serializer = self.get_serializer(position)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        position = PositionService.create_position(**serializer.validated_data)
        output_serializer = self.get_serializer(position)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        position = self.get_object()
        serializer = self.get_serializer(position, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        updated_position = PositionService.update_position(position, **serializer.validated_data)
        output_serializer = self.get_serializer(updated_position)
        return Response(output_serializer.data)

    def destroy(self, request, *args, **kwargs):
        position = self.get_object()
        PositionService.delete_position(position)
        return Response(status=status.HTTP_204_NO_CONTENT)
