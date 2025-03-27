from rest_framework import viewsets, mixins, filters
from rest_framework.pagination import PageNumberPagination
from drf_spectacular.utils import extend_schema, OpenApiParameter


class CustomPagination(PageNumberPagination):
    """
    Кастомный пагинатор, переиспользуемый во всех представлениях
    """
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


@extend_schema(
    parameters=[
        OpenApiParameter(
            name='search',
            description='Поисковый запрос для фильтрации по указанным полям.',
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
class AbstractSearchViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Абстрактный ViewSet для поддержки поиска и пагинации.
    Для использования необходимо определить:
      - queryset
      - serializer_class
      - search_fields (например, ['name', 'description'])
    """
    filter_backends = [filters.SearchFilter]
    search_fields = []  # Конкретное представление должно задать нужные поля
    pagination_class = CustomPagination
