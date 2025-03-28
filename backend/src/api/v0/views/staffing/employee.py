from django.db.models import Q
from drf_spectacular.utils import OpenApiParameter, extend_schema, OpenApiExample, extend_schema_view
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.authentication import BasicAuthentication
from apps.staffing.models import Employee
from apps.staffing.serializers import EmployeeSerializer
from apps.staffing.services import EmployeeService


class EmployeePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

@extend_schema_view(
    list=extend_schema(
        summary="Получение списка сотрудников",
        description=(
            "Возвращает список сотрудников с пагинацией. Поддерживает поиск по: "
            "- Началу фамилии\n"
            "- Началу имени\n"
            "- Началу отчества\n"
            "- Номеру телефона\n"
            "Пример: /api/employees/?search=Иван Петров 7900"
        ),
        parameters=[
            OpenApiParameter(
                name='search',
                description='Поисковая строка (разделение терминов пробелом)',
                required=False,
                type=str,
                examples=[
                    OpenApiExample(
                        'Пример 1',
                        value='Иванов'
                    ),
                    OpenApiExample(
                        'Пример 2',
                        value='Сидоров 7999'
                    ),
                ]
            )
        ]
    ),
    retrieve=extend_schema(
        summary="Получение сотрудника по ID",
        responses={200: EmployeeSerializer}
    ),
    create=extend_schema(
        summary="Создание нового сотрудника",
        responses={
            201: EmployeeSerializer,
            400: OpenApiExample(
                'Пример ошибки',
                value={"detail": "Validation error description"}
            )
        }
    ),
    update=extend_schema(
        summary="Полное обновление данных сотрудника",
        responses={200: EmployeeSerializer}
    ),
    partial_update=extend_schema(
        summary="Частичное обновление данных сотрудника",
        responses={200: EmployeeSerializer}
    ),
    destroy=extend_schema(
        summary="Удаление сотрудника",
        responses={
            204: None,
            403: OpenApiExample(
                'Пример ошибки прав',
                value={"detail": "You do not have permission to perform this action."}
            )
        }
    )
)
class EmployeeViewSet(viewsets.ModelViewSet):
    """
    API для работы с сотрудниками с поддержкой пагинации.
    Поддерживаются операции:
      - list: получение списка сотрудников с пагинацией (требуется permission "staffing.view_employee"),
      - retrieve: получение сотрудника по UUID (требуется permission "staffing.view_employee"),
      - create: создание нового сотрудника (требуется permission "staffing.add_employee"),
      - update / partial_update: обновление сотрудника (требуется permission "staffing.change_employee"),
      - destroy: удаление сотрудника (требуется permission "staffing.delete_employee").
    """
    queryset = Employee.objects.all().order_by('id')
    serializer_class = EmployeeSerializer
    pagination_class = EmployeePagination
    # authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()
        search_term = self.request.query_params.get('search', '').strip()

        if search_term:
            query = Q()
            for term in search_term.split():
                if not term:
                    continue

                query |= (
                        Q(last_name__istartswith=term) |
                        Q(first_name__istartswith=term) |
                        Q(patronymic__istartswith=term) |
                        Q(phone__istartswith=term)
                )
            queryset = queryset.filter(query)

        return queryset.order_by('last_name', 'first_name', 'patronymic')

    def retrieve(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        employee = EmployeeService.get_employee_by_pk(pk)
        if not employee:
            return Response({"detail": "Сотрудник не найден."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(employee)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        employee = EmployeeService.get_employee_by_pk(pk)
        if not employee:
            return Response({"detail": "Сотрудник не найден."}, status=status.HTTP_404_NOT_FOUND)
        EmployeeService.delete_employee(employee)
        return Response(status=status.HTTP_204_NO_CONTENT)
