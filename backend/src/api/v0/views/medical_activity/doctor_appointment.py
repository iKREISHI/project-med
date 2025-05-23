from django.utils.timezone import now
from drf_spectacular.utils import extend_schema, OpenApiParameter, extend_schema_view, OpenApiResponse
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from api.v0.permissions.strict_django_model_permissions import StrictDjangoModelPermissions
from apps.medical_activity.models import DoctorAppointment
from apps.medical_activity.serializers import DoctorAppointmentSerializer
from apps.medical_activity.service import DoctorAppointmentService
from apps.staffing.models import Employee


class DoctorAppointmentPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    ordering = 'id'

@extend_schema_view(
    list=extend_schema(
        summary="Получение списка приемов с пагинацией",
        description=(
            "Возвращает список приемов к врачу с поддержкой пагинации и фильтрацией по диапазону дат. "
            "Если переданы query-параметры 'start_date' и 'end_date' в формате YYYY-MM-DD, то "
            "будут возвращаться только те приемы, у которых appointment_date попадает в указанный диапазон."
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
        responses={200: DoctorAppointmentSerializer}
    ),
    retrieve=extend_schema(
        summary="Получение приема по id",
        responses={200: DoctorAppointmentSerializer}
    ),
    create=extend_schema(
        summary="Создание нового приема",
        responses={201: DoctorAppointmentSerializer}
    ),
    update=extend_schema(
        summary="Полное обновление приема",
        responses={200: DoctorAppointmentSerializer}
    ),
    partial_update=extend_schema(
        summary="Частичное обновление приема",
        responses={200: DoctorAppointmentSerializer}
    ),
    destroy=extend_schema(
        summary="Удаление приема",
        responses={204: {}}
    )
)
class DoctorAppointmentViewSet(viewsets.ModelViewSet):
    """
    API для работы с приемами к врачу с поддержкой пагинации.
    Поддерживаются операции:
      - list: получение списка приемов с пагинацией
        (требуется permission "doctor-appointment.view_doctorappointment"),
      - retrieve: получение приема по id
        (требуется permission "doctor-appointment.view_doctorappointment"),
      - create: создание нового приема
        (требуется permission "doctor-appointment.add_doctorappointment"),
      - update / partial_update: обновление приема
        (требуется permission "doctor-appointment.change_doctorappointment"),
      - destroy: удаление приема
        (требуется permission "doctor-appointment.delete_doctorappointment").
    """
    queryset = DoctorAppointment.objects.all().order_by('appointment_date', 'start_time')
    serializer_class = DoctorAppointmentSerializer
    pagination_class = DoctorAppointmentPagination
    permission_classes = [IsAuthenticated, StrictDjangoModelPermissions]
    lookup_field = 'id'

    filter_backends = [filters.SearchFilter]
    search_fields = [
        'patient__last_name',
        'patient__first_name',
        'diagnosis__name',
        'start_time'
    ]

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

    @extend_schema(
        operation_id="sign_doctor_appointment",
        description="Подписание приема врача с электронным подписям пользователем, который является сотрудником.",
        parameters=[
            OpenApiParameter(
                name='Authorization',
                description='Токен авторизации пользователя.',
                required=True,
                type=str,
                location=OpenApiParameter.HEADER,
            ),
        ],
        responses={
            200: OpenApiResponse(
                description="Успешное подписание приема врача",
                examples={"application/json": {"success": "Данные успешно подписаны."}}
            ),
            400: OpenApiResponse(
                description="Ошибка при подписании (например, если прием уже подписан)",
                examples={"application/json": {"detail": "Документ уже был подписан"}}
            ),
            404: OpenApiResponse(
                description="Прием врача не найден или удалён",
                examples={"application/json": {"detail": "Объект не был найден, или удалён"}}
            ),
            401: OpenApiResponse(
                description="Неавторизованный доступ",
                examples={"application/json": {"detail": "Авторизуйтесь чтобы выполнить это действие."}}
            ),
            403: OpenApiResponse(
                description="Пользователь не является сотрудником, или не имеет прав на подписание",
                examples={"application/json": {
                    "detail": "Для выполнения этого действия пользователь должен числиться как сотрудник."}}
            ),
        }
    )
    @action(detail=True, methods=['post'], name='sign')
    def sign(self, request, *args, **kwargs):
        pk = kwargs.get('pk')  # Получаем pk из kwargs

        if not pk:
            return Response({'detail': 'Объект не найден.'}, status=status.HTTP_404_NOT_FOUND)

        # Проверка на авторизацию
        if not self.request.user.is_authenticated:
            return Response({'detail': 'Авторизуйтесь чтобы выполнить это действие.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        # Проверка, что пользователь является сотрудником
        employee = Employee.objects.filter(user=request.user).first()
        if not employee:
            return Response({'detail': 'Для выполнения этого действия пользователь должен числиться как сотрудник.'},
                            status=status.HTTP_403_FORBIDDEN)

        # Получаем прием врача по pk
        obj = DoctorAppointment.objects.filter(pk=pk).first()

        if not obj:
            return Response({'detail': 'Объект не был найден, или удалён'}, status=status.HTTP_404_NOT_FOUND)

        # Проверка на уже подписанный документ
        if obj.is_signed:
            return Response({'detail': 'Документ уже был подписан'}, status=status.HTTP_400_BAD_REQUEST)

        # Подписание приема врача
        obj.is_signed = True
        obj.signed_by = employee
        obj.signed_date = now().date()
        obj.save()

        return Response({'success': 'Данные успешно подписаны.'}, status=status.HTTP_201_CREATED)
