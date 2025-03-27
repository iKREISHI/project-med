from crypt import methods
from xmlrpc.client import Fault

from django.contrib.admin import action
from django.db.models import Q
from drf_spectacular.utils import OpenApiParameter, extend_schema, OpenApiExample, extend_schema_view
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from apps.clients.models import Patient
from apps.clients.serializers import PatientSerializer
from apps.clients.services import PatientService


class PatientPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

@extend_schema_view(
    list=extend_schema(
        summary="Получение списка пациентов",
        description=(
            "Возвращает список пациентов с пагинацией. Поддерживает поиск по: "
            "- Началу фамилии (регистронезависимый)\n"
            "- Началу имени\n"
            "- Началу отчества\n"
            "- Номеру телефона\n"
            "Пример: /api/patients/?search=Иван Петров 7900"
        ),
        parameters=[
            OpenApiParameter(
                name='search',
                description='Поисковая строка (разделение терминов пробелом)',
                required=False,
                type=str,
                examples=[
                    OpenApiExample(
                        'Пример 1',
                        value='Иванов'
                    ),
                    OpenApiExample(
                        'Пример 2',
                        value='Сидоров 7999'
                    ),
                ]
            )
        ]
    ),
    retrieve=extend_schema(
        summary="Получение пациента по ID",
        responses={200: PatientSerializer}
    ),
    create=extend_schema(
        summary="Создание нового пациента",
        responses={
            201: PatientSerializer,
            400: OpenApiExample(
                'Пример ошибки',
                value={"detail": "Validation error description"}
            )
        }
    ),
    update=extend_schema(
        summary="Полное обновление данных пациента",
        responses={200: PatientSerializer}
    ),
    partial_update=extend_schema(
        summary="Частичное обновление данных пациента",
        responses={200: PatientSerializer}
    ),
    destroy=extend_schema(
        summary="Удаление пациента",
        responses={
            204: None,
            403: OpenApiExample(
                'Пример ошибки прав',
                value={"detail": "You do not have permission to perform this action."}
            )
        }
    )
)
class PatientViewSet(viewsets.ModelViewSet):
    """
    API для работы с пациентами с поддержкой пагинации.
    Поддерживаются операции:
      - list: получение списка пациентов с пагинацией и поиском,
      - retrieve: получение пациента по ID,
      - create: создание нового пациента,
      - update / partial_update: обновление пациента,
      - destroy: удаление пациента.

    Поиск пациентов осуществляется через параметр `search` в GET-запросе.
    Поиск выполняется по:
    - началу фамилии (case-insensitive)
    - началу имени (case-insensitive)
    - началу отчества (case-insensitive)
    - названию контрагента (частичное совпадение)
    """
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    pagination_class = PatientPagination
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
        patient = PatientService.get_patient_by_id(pk)
        if not patient:
            return Response({"detail": "Пациент не найден."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(patient)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        pk = kwargs.get('pk')

        if not (request.user.is_staff or request.user.is_superuser):
            return Response(status=status.HTTP_403_FORBIDDEN)

        patient = PatientService.get_patient_by_id(pk)
        if not patient:
            return Response({"detail": "Пациент не найден."}, status=status.HTTP_404_NOT_FOUND)

        PatientService.delete_patient(patient)
        return Response(status=status.HTTP_204_NO_CONTENT)

