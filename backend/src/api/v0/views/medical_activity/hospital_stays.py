from rest_framework import viewsets, status
from rest_framework.response import Response
from api.v0.views.abstract import CustomPagination
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from api.v0.permissions.strict_django_model_permissions import StrictDjangoModelPermissions
from apps.medical_activity.models import HospitalStays
from apps.medical_activity.serializers import HospitalStaysSerializer


class HospitalStaysViewSet(viewsets.ModelViewSet):
    """
    API для работы с госпитализацией пациента с поддержкой пагинации.
    Поддерживаются операции:
      - list: получение списка с пагинацией
        (требуется permission "hospital_stays.view_hospitalstays"),
      - retrieve: получение  по id
        (требуется permission "hospital_stays.view_hospitalstays"),
      - create: создание нового
        (требуется permission "hospital_stays.add_hospitalstays"),
      - update / partial_update: обновление
        (требуется permission "hospital_stays.change_hospitalstays"),
      - destroy: удаление
        (требуется permission "hospital_stays.delete_hospitalstays").
    """

    queryset = HospitalStays.objects.all().order_by('id')
    serializer_class = HospitalStaysSerializer
    pagination_class = CustomPagination
    permission_classes = (IsAuthenticated, StrictDjangoModelPermissions)
    lookup_field = 'id'