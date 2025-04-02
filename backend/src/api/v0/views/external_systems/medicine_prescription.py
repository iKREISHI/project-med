from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import viewsets, filters, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.v0.permissions.strict_django_model_permissions import StrictDjangoModelPermissions

from apps.external_systems.models import Prescription
from apps.external_systems.serializers.medicine_prescription import PrescriptionModelSerializer
from apps.staffing.models import Employee


class MedicinePrescriptionPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    ordering = 'id'

@extend_schema(
    description="API для работы с рецептами на лекарства. При создании рецепта автоматически устанавливаются is_signed=True и signed_by=request.user.",
    parameters=[
        OpenApiParameter(
            name='search',
            description='Поисковый запрос для поиска по полям: patient__last_name, patient__first_name, is_send, date_created.',
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name='page',
            description='Номер страницы для пагинации.',
            required=False,
            type=int,
        ),
        OpenApiParameter(
            name='page_size',
            description='Количество объектов на странице.',
            required=False,
            type=int,
        ),
    ],
    responses={
        201: {
            "description": "Рецепт успешно создан.",
            "examples": {
                "application/json": {
                    "id": "a8d9f0f1-3b57-4e9e-9f3e-2d3f9a0c1234",
                    "system": "test",
                    "document_number": "a8d9f0f1-3b57-4e9e-9f3e-2d3f9a0c1234",
                    "patient": 1,
                    "description": "Выписанный рецепт",
                    "doc_content": "<p>Some HTML content</p>",
                    "is_send": False,
                    "date_created": "2025-04-02T18:40:00Z",
                    "is_signed": True,
                    "signed_by": 1,
                    "signed_date": "2025-04-02"
                }
            }
        },
        400: {
            "description": "Ошибка валидации рецепта.",
            "examples": {
                "application/json": {
                    "patient": ["Пациент обязателен для рецепта."],
                    "doc_content": ["Содержимое документа слишком длинное. Максимальная длина 50000 символов."]
                }
            }
        }
    }
)
class MedicinePrescriptionViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'list', 'post', 'head', 'options']
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionModelSerializer
    pagination_class = MedicinePrescriptionPagination
    permission_classes = (IsAuthenticated, StrictDjangoModelPermissions)

    filter_backends = [filters.SearchFilter]
    search_fields = [
        'patient__last_name',
        'patient__first_name',
        'is_send',
        'date_created'
    ]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Создание рецепта с автоматической подписью.
        При создании устанавливаются is_signed = True и signed_by = request.user.
        Если валидация не проходит, возвращаются ошибки по соответствующим полям.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            employee = Employee.objects.filter(user=request.user).first()
            prescription = serializer.save(is_signed=True, signed_by=employee)
            return Response(self.get_serializer(prescription).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

