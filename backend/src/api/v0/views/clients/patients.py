from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from apps.clients.models import Patient
from apps.clients.serializers import PatientSerializer
from apps.clients.services import PatientService


class PatientPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class PatientViewSet(viewsets.ModelViewSet):
    """
    API для работы с пациентами с поддержкой пагинации.
    Поддерживаются операции:
      - list: получение списка пациентов с пагинацией,
      - retrieve: получение пациента по UUID,
      - create: создание нового пациента,
      - update / partial_update: обновление пациента,
      - destroy: удаление пациента.
    """
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    lookup_field = 'uuid'
    pagination_class = PatientPagination

    def retrieve(self, request, *args, **kwargs):
        uuid = kwargs.get('uuid')
        patient = PatientService.get_patient_by_uuid(uuid)
        if not patient:
            return Response({"detail": "Пациент не найден."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(patient)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        uuid = kwargs.get('uuid')
        patient = PatientService.get_patient_by_uuid(uuid)
        if not patient:
            return Response({"detail": "Пациент не найден."}, status=status.HTTP_404_NOT_FOUND)
        PatientService.delete_patient(patient)
        return Response(status=status.HTTP_204_NO_CONTENT)
