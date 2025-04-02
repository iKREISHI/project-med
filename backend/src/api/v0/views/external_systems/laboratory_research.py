from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from apps.external_systems.models import LaboratoryResearch
from apps.external_systems.serializers.laboratory_research import LaboratoryResearchModelSerializer

# Пагинация для лабораторных исследований
class LaboratoryResearchPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

@extend_schema(
    parameters=[
        OpenApiParameter(
            name='search',
            description='Поисковый запрос для поиска по полям: number, status, laboratory__name.',
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
    ]
)
class LaboratoryResearchModelViewSet(viewsets.ModelViewSet):
    """
    API для просмотра лабораторных исследований.
    """
    queryset = LaboratoryResearch.objects.all()
    http_method_names = ['get', 'list', 'head', 'options']
    serializer_class = LaboratoryResearchModelSerializer
    pagination_class = LaboratoryResearchPagination
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    # Используем lab_direction_guid в качестве поля для поиска записи
    lookup_field = 'lab_direction_guid'
    filter_backends = [filters.SearchFilter]
    search_fields = ['number', 'status', 'laboratory__name']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)