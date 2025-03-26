from rest_framework import viewsets, status
from rest_framework.response import Response
from api.v0.views.abstract import CustomPagination
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from api.v0.permissions.strict_django_model_permissions import StrictDjangoModelPermissions
from apps.medical_activity.models import Shift
from apps.medical_activity.serializers import ShiftSerializer


class ShiftViewSet(viewsets.ModelViewSet):
    """
    API для работы с врачебной сменой (дежурствами) с поддержкой пагинации.
    Поддерживаются операции:
      - list: получение списка с пагинацией
        (требуется permission "shift.view_shift"),
      - retrieve: получение приема по id
        (требуется permission "shift.view_shift"),
      - create: создание нового приема
        (требуется permission "shift.add_shift"),
      - update / partial_update: обновление приема
        (требуется permission "shift.change_shift"),
      - destroy: удаление приема
        (требуется permission "shift.delete_shift").
    """

    queryset = Shift.objects.all().order_by('id')
    serializer_class = ShiftSerializer
    pagination_class = CustomPagination
    permission_classes = (IsAuthenticated, StrictDjangoModelPermissions)
    lookup_field = 'id'