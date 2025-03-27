from django.db.models import Q
from drf_spectacular.utils import OpenApiParameter, extend_schema
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

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='search',
                description='Поиск по фамилии, имени, отчеству или телефону',
                required=False,
                type=str
            )
        ]
    )
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
