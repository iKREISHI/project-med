import datetime
from rest_framework import viewsets, status
from rest_framework.response import Response
from api.v0.views.abstract import CustomPagination
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiParameter

from apps.medical_activity.models import BookingAppointment
from apps.medical_activity.serializers import BookingAppointmentSerializer


@extend_schema_view(
    list=extend_schema(
        summary="Получение списка записей на прием",
        description=(
            "Возвращает список записей на прием с поддержкой пагинации и фильтрацией по диапазону дат. "
            "Если переданы query-параметры 'start_date' и 'end_date' в формате YYYY-MM-DD, то "
            "будут возвращаться только те записи, у которых vizit_datetime попадает в указанный диапазон "
            "от начала start_date до конца end_date (до 23:59:59)."
        ),
        parameters=[
            OpenApiParameter(
                "start_date",
                description="Начальная дата в формате YYYY-MM-DD",
                required=False,
                type=str
            ),
            OpenApiParameter(
                "end_date",
                description="Конечная дата в формате YYYY-MM-DD",
                required=False,
                type=str
            )
        ],
        responses={200: BookingAppointmentSerializer}
    ),
    retrieve=extend_schema(
        summary="Получение записи на прием по id",
        responses={200: BookingAppointmentSerializer}
    ),
    create=extend_schema(
        summary="Создание новой записи на прием",
        responses={201: BookingAppointmentSerializer}
    ),
    update=extend_schema(
        summary="Полное обновление записи на прием",
        responses={200: BookingAppointmentSerializer}
    ),
    partial_update=extend_schema(
        summary="Частичное обновление записи на прием",
        responses={200: BookingAppointmentSerializer}
    ),
    destroy=extend_schema(
        summary="Удаление записи на прием",
        responses={204: {}}
    )
)
class BookingAppointmentViewSet(viewsets.ModelViewSet):
    """
        API для работы с записью на прием с поддержкой пагинации.
        Поддерживаются операции:
          - list: получение списка с пагинацией
          - retrieve: получение по id
          - create: создание
          - update / partial_update: обновление
          - destroy: удаление

        Дополнительно поддерживается фильтрация по диапазону дат.
        При передаче query-параметров "start_date" и "end_date" (формат YYYY-MM-DD)
        будут возвращаться только те записи, у которых vizit_datetime попадает в диапазон
        от начала start_date до конца end_date.
    """
    queryset = BookingAppointment.objects.all()
    serializer_class = BookingAppointmentSerializer
    pagination_class = CustomPagination
    permission_classes = (IsAuthenticated, DjangoModelPermissions)
    search_fields = [
        'patient__last_name',
        'patient__first_name',
        'doctor__first_name',
        'doctor__last_name',
        'vizit_datetime',
    ]
    lookup_field = 'id'

    def get_queryset(self):
        qs = super().get_queryset()
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")
        if start_date and end_date:
            try:
                start_dt = datetime.datetime.strptime(start_date, "%Y-%m-%d")
                # Конец дня: 23:59:59
                end_dt = datetime.datetime.strptime(end_date, "%Y-%m-%d") + datetime.timedelta(hours=23, minutes=59, seconds=59)
                qs = qs.filter(vizit_datetime__gte=start_dt, vizit_datetime__lte=end_dt)
            except ValueError:
                qs = qs.none()
        return qs
