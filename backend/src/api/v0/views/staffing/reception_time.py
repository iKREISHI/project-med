from rest_framework.permissions import IsAuthenticated

from apps.company_structure.models import FilialDepartment
from apps.staffing.models import ReceptionTime
from apps.staffing.serializers import ReceptionTimeSerializer
from rest_framework import viewsets, exceptions
from django.shortcuts import get_object_or_404



class ReceptionTimeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReceptionTimeSerializer

    def get_queryset(self):
        user = self.request.user
        department_id = self.request.query_params.get('department')

        if not department_id:
            raise exceptions.ValidationError(
                {"detail": "Необходимо указать параметр 'department' в запросе /?department=<id>"}
            )

        department = get_object_or_404(FilialDepartment, pk=department_id)

        # Проверяем что пользователь принадлежит к запрашиваемому отделу
        if not (hasattr(user, 'employee_profile') or user.employee_profile.department != department):
            raise exceptions.PermissionDenied({"detail": "У вас нет доступа к этому отделению"})

        return ReceptionTime.objects.filter(
            doctor__department=department
        )

    def list(self, request, *args, **kwargs):
        """
        Добавляем описание параметра в документации
        """
        query_params = [
            {
                'name': 'department',
                'required': True,
                'in': 'query',
                'description': 'ID отделения',
                'schema': {
                    'type': 'integer'
                }
            }
        ]
        return super().list(request, *args, **kwargs)