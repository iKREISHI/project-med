import datetime
from rest_framework import viewsets, status
from rest_framework.response import Response
from api.v0.views.abstract import CustomPagination
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from api.v0.permissions.strict_django_model_permissions import StrictDjangoModelPermissions
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiParameter
from apps.medical_activity.models import Shift
from apps.medical_activity.serializers import ShiftSerializer

@extend_schema_view(
    list=extend_schema(
        summary="Получение списка смен",
        description=(
            "Возвращает список врачебных смен с поддержкой пагинации и фильтрацией по диапазону дат. "
            "Если переданы query-параметры 'start_date' и 'end_date' в формате YYYY-MM-DD, то "
            "будут возвращаться только те смены, у которых start_time попадает в указанный диапазон "
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
        responses={200: ShiftSerializer}
    ),
    retrieve=extend_schema(
        summary="Получение смены по id",
        responses={200: ShiftSerializer}
    ),
    create=extend_schema(
        summary="Создание новой смены",
        responses={201: ShiftSerializer}
    ),
    update=extend_schema(
        summary="Полное обновление смены",
        responses={200: ShiftSerializer}
    ),
    partial_update=extend_schema(
        summary="Частичное обновление смены",
        responses={200: ShiftSerializer}
    ),
    destroy=extend_schema(
        summary="Удаление смены",
        responses={204: {}}
    )
)
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

    Дополнительно поддерживается фильтрация по диапазону дат.
    При передаче query-параметров "start_date" и "end_date" (формат YYYY-MM-DD)
    будут возвращаться только те смены, у которых start_time попадает в диапазон
    от начала start_date до конца end_date.
    """
    queryset = Shift.objects.all().order_by('id')
    serializer_class = ShiftSerializer
    pagination_class = CustomPagination
    permission_classes = (IsAuthenticated, StrictDjangoModelPermissions)
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
                qs = qs.filter(start_time__gte=start_dt, start_time__lte=end_dt)
            except ValueError:
                qs = qs.none()
        return qs
