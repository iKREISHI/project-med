from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from apps.external_systems.models import Medicine
from apps.external_systems.serializers.medicine import MedicineModelSerializer

class MedicinePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

@extend_schema(
    parameters=[
        OpenApiParameter(
            name='search',
            description=('Поисковый запрос для поиска по следующим полям: '
                         'klp_code, smnn_code, ktru_code, name_trade, country, '
                         'oksm_code, name_producer.'),
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
class MedicineModelViewSet(viewsets.ModelViewSet):
    """
    API для просмотра аптечных препаратов.
    """
    queryset = Medicine.objects.all()
    http_method_names = ['get', 'list', 'head', 'options']
    serializer_class = MedicineModelSerializer
    pagination_class = MedicinePagination
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    lookup_field = 'id'
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'klp_code',
        'smnn_code',
        'ktru_code',
        'name_trade',
        'country',
        'oksm_code',
        'name_producer',
    ]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
