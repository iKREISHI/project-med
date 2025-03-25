from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from apps.registry.models.medical_card import MedicalCard
from apps.registry.serializers.medical_card import MedicalCardSerializer
from apps.registry.services import MedicalCardService
from rest_framework import filters
from drf_spectacular.utils import extend_schema, OpenApiParameter


class MedicalCardPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


@extend_schema(
    parameters=[
        OpenApiParameter(
            name='search',
            description='Поисковый запрос для поиска по следующим полям: '
                        'name, number, card_type__name, '
                        'client__last_name, client__first_name, client__patronymic, '
                        'client__date_of_birth.',
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
class MedicalCardViewSet(viewsets.ModelViewSet):
    """
    API для работы с медицинскими картами с поддержкой пагинации.

    Поддерживаются операции:
      - list: получение списка медицинских карт (требуется permission "registry.view_medicalcard"),
      - retrieve: получение медицинской карты по ID (требуется permission "registry.view_medicalcard"),
      - create: создание новой медицинской карты (требуется permission "registry.add_medicalcard"),
      - update/partial_update: обновление медицинской карты (требуется permission "registry.change_medicalcard"),
      - destroy: удаление медицинской карты (требуется permission "registry.delete_medicalcard").
    """
    queryset = MedicalCard.objects.all()
    serializer_class = MedicalCardSerializer
    pagination_class = MedicalCardPagination
    permission_classes = [IsAuthenticated, DjangoModelPermissions]

    filter_backends = [filters.SearchFilter]
    search_fields = [
        'name', 'number', 'card_type__name',
        'client__last_name', 'client__first_name',
        'client__patronymic', 'client__date_of_birth',
    ]

    def retrieve(self, request, *args, **kwargs):
        id = kwargs.get('pk')
        card = MedicalCardService.get_medical_card_by_id(id)
        if not card:
            return Response({"detail": "Медицинская карта не найдена."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(card)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        id = kwargs.get('pk')
        card = MedicalCardService.get_medical_card_by_id(id)
        if not card:
            return Response({"detail": "Медицинская карта не найдена."}, status=status.HTTP_404_NOT_FOUND)
        MedicalCardService.delete_medical_card(card)
        return Response(status=status.HTTP_204_NO_CONTENT)
