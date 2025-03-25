from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from api.v0.permissions.strict_django_model_permissions import StrictDjangoModelPermissions
from apps.medical_activity.models import DoctorAppointment
from apps.medical_activity.serializers import DoctorAppointmentSerializer
from apps.medical_activity.service import DoctorAppointmentService


class DoctorAppointmentPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class DoctorAppointmentViewSet(viewsets.ModelViewSet):
    """
    API для работы с приемами к врачу с поддержкой пагинации.
    Поддерживаются операции:
      - list: получение списка приемов с пагинацией
        (требуется permission "medical_activity.view_doctorappointment"),
      - retrieve: получение приема по id
        (требуется permission "medical_activity.view_doctorappointment"),
      - create: создание нового приема
        (требуется permission "medical_activity.add_doctorappointment"),
      - update / partial_update: обновление приема
        (требуется permission "medical_activity.change_doctorappointment"),
      - destroy: удаление приема
        (требуется permission "medical_activity.delete_doctorappointment").
    """
    queryset = DoctorAppointment.objects.all().order_by('appointment_date', 'start_time')
    serializer_class = DoctorAppointmentSerializer
    pagination_class = DoctorAppointmentPagination
    permission_classes = [IsAuthenticated, StrictDjangoModelPermissions]
    lookup_field = 'id'

    def retrieve(self, request, *args, **kwargs):
        appointment_id = kwargs.get(self.lookup_field)
        appointment = DoctorAppointmentService.get_appointment_by_id(appointment_id)
        if not appointment:
            return Response({"detail": "Прием не найден."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(appointment)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        appointment_id = kwargs.get(self.lookup_field)
        appointment = DoctorAppointmentService.get_appointment_by_id(appointment_id)
        if not appointment:
            return Response({"detail": "Прием не найден."}, status=status.HTTP_404_NOT_FOUND)
        DoctorAppointmentService.delete_appointment(appointment)
        return Response(status=status.HTTP_204_NO_CONTENT)
