from rest_framework import viewsets, status
from rest_framework.response import Response
from api.v0.views.abstract import CustomPagination
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from api.v0.permissions.strict_django_model_permissions import StrictDjangoModelPermissions
from apps.medical_activity.models import ShiftTransfer
from apps.medical_activity.serializers import ShiftTransferSerializer


class ShiftTransferViewSet(viewsets.ModelViewSet):
    """
    API для работы с передачей врачебной сменой (дежурствами) с поддержкой пагинации.
    Поддерживаются операции:
      - list: получение списка с пагинацией
        (требуется permission "shift-transfer.view_shifttransfer"),
      - retrieve: получение приема по id
        (требуется permission "shift-transfer.view_shifttransfer"),
      - create: создание нового приема
        (требуется permission "shift-transfer.add_shifttransfer"),
      - update / partial_update: обновление приема
        (требуется permission "shift-transfer.change_shifttransfer"),
      - destroy: удаление приема
        (требуется permission "shift-transfer.delete_shifttransfer").
    """

    queryset = ShiftTransfer.objects.all().order_by('id')
    serializer_class = ShiftTransferSerializer
    pagination_class = CustomPagination
    permission_classes = (IsAuthenticated, StrictDjangoModelPermissions)
    lookup_field = 'id'