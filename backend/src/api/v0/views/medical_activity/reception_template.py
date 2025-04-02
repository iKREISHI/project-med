from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination
from apps.medical_activity.models import ReceptionTemplate
from apps.medical_activity.serializers import ReceptionTemplateSerializer
from api.v0.permissions.strict_django_model_permissions import StrictDjangoModelPermissions
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    ordering = 'id'


class ReceptionTemplateViewSet(viewsets.ModelViewSet):
    """
        API для работы с врачебными шаблонами.
        Поддерживаются операции:
          - list: получение списка
            (требуется permission "reception_template.receptiontemplate"),
          - retrieve: получение  по id
            (требуется permission "reception_template.receptiontemplate"),
          - create: создание
            (требуется permission "reception_template.receptiontemplate"),
          - update / partial_update: обновление приема
            (требуется permission "reception_template.receptiontemplate"),
          - destroy: удаление
            (требуется permission "reception_template.receptiontemplate").
        """
    queryset = ReceptionTemplate.objects.all()
    serializer_class = ReceptionTemplateSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticated, StrictDjangoModelPermissions]
    lookup_field = 'id'

    filter_backends = [filters.SearchFilter]
    search_fields = [
        'name',
        'specialization__title',
    ]
