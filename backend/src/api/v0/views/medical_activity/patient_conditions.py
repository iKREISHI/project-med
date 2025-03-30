from rest_framework import viewsets, status
from rest_framework.response import Response
from api.v0.views.abstract import CustomPagination
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from api.v0.permissions.strict_django_model_permissions import StrictDjangoModelPermissions
from apps.medical_activity.models import PatientCondition
from apps.medical_activity.serializers import PatientConditionSerializer


class PatientConditionViewSet(viewsets.ModelViewSet):
    """
    API для работы с состоянием пациента с поддержкой пагинации.
    Поддерживаются операции:
      - list: получение списка с пагинацией
        (требуется permission "patient_condition.view_patientcondition"),
      - retrieve: получение  по id
        (требуется permission "patient_condition.view_patientcondition"),
      - create: создание нового
        (требуется permission "patient_condition.add_patientcondition"),
      - update / partial_update: обновление
        (требуется permission "patient_condition.change_patientcondition"),
      - destroy: удаление
        (требуется permission "patient_condition.delete_patientcondition").
    """

    queryset = PatientCondition.objects.all().order_by('id')
    serializer_class = PatientConditionSerializer
    pagination_class = CustomPagination
    permission_classes = (IsAuthenticated, StrictDjangoModelPermissions)
    lookup_field = 'id'