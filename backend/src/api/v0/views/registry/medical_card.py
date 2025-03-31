from django.utils.timezone import now
from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from apps.registry.models.medical_card import MedicalCard
from apps.registry.serializers.medical_card import MedicalCardSerializer
from apps.registry.services import MedicalCardService
from rest_framework import filters
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from apps.staffing.models import Employee


class MedicalCardPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    ordering = 'id'

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

    @extend_schema(
        operation_id="sign_medical_card",
        description="Подписание медицинской карты с электронным подписям пользователем, который является сотрудником.",
        parameters=[
            OpenApiParameter(
                name='Authorization',
                description='Токен авторизации пользователя.',
                required=True,
                type=str,
                location=OpenApiParameter.HEADER,
            ),
        ],
        responses={
            200: OpenApiResponse(
                description="Успешное подписание медицинской карты",
                examples={"application/json": {"success": "Данные успешно подписаны."}}
            ),
            400: OpenApiResponse(
                description="Ошибка при подписании (например, если карта уже подписана)",
                examples={"application/json": {"detail": "Документ уже был подписан"}}
            ),
            404: OpenApiResponse(
                description="Медицинская карта не найдена или удалена",
                examples={"application/json": {"detail": "Объект не был найден, или удалён"}}
            ),
            401: OpenApiResponse(
                description="Неавторизованный доступ",
                examples={"application/json": {"detail": "Авторизуйтесь чтобы выполнить это действие."}}
            ),
            403: OpenApiResponse(
                description="Пользователь не является сотрудником, или не имеет прав на подписание",
                examples={"application/json": {
                    "detail": "Для выполнения этого действия пользователь должен числиться как сотрудник."}}
            ),
        }
    )
    @action(detail=True, methods=['post'], name='sign')
    def sign(self, request, *args, **kwargs):
        pk = kwargs.get('pk')  # Получаем pk из kwargs

        if not pk:
            return Response({'detail': 'Объект не найден.'}, status=status.HTTP_400_BAD_REQUEST)

        # Проверка на авторизацию
        if not self.request.user.is_authenticated:
            return Response({'detail': 'Авторизуйтесь чтобы выполнить это действие.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        # Проверка, что пользователь является сотрудником
        employee = Employee.objects.filter(user=request.user).first()
        if not employee:
            return Response({'detail': 'Для выполнения этого действия пользователь должен числиться как сотрудник.'},
                            status=status.HTTP_403_FORBIDDEN)

        # Получаем медицинскую карту по pk
        obj = MedicalCard.objects.filter(pk=pk).first()

        if not obj:
            return Response({'detail': 'Объект не был найден, или удалён'}, status=status.HTTP_404_NOT_FOUND)

        # Проверка на уже подписанный документ
        if obj.is_signed:
            return Response({'detail': 'Документ уже был подписан'}, status=status.HTTP_400_BAD_REQUEST)

        # Подписание медицинской карты
        obj.is_signed = True
        obj.signed_by = employee
        obj.signed_date = now().date()
        obj.save()

        return Response({'success': 'Данные успешно подписаны.'}, status=status.HTTP_201_CREATED)



