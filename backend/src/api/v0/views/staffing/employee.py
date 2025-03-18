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
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    lookup_field = 'uuid'
    pagination_class = EmployeePagination
    # authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    def retrieve(self, request, *args, **kwargs):
        uuid = kwargs.get('uuid')
        employee = EmployeeService.get_employee_by_uuid(uuid)
        if not employee:
            return Response({"detail": "Сотрудник не найден."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(employee)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        uuid = kwargs.get('uuid')
        employee = EmployeeService.get_employee_by_uuid(uuid)
        if not employee:
            return Response({"detail": "Сотрудник не найден."}, status=status.HTTP_404_NOT_FOUND)
        EmployeeService.delete_employee(employee)
        return Response(status=status.HTTP_204_NO_CONTENT)
