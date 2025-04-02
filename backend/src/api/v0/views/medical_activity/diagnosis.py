from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from api.v0.views.abstract import CustomPagination
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from api.v0.permissions.strict_django_model_permissions import StrictDjangoModelPermissions

from apps.medical_activity.models.diagnosis import Diagnosis
from apps.medical_activity.serializers.diagnosis import DiagnosisSerializer


class DiagnosisViewSet(viewsets.ModelViewSet):
    queryset = Diagnosis.objects.all()
    serializer_class = DiagnosisSerializer
    pagination_class = CustomPagination
    permission_classes = (IsAuthenticated, StrictDjangoModelPermissions)
    lookup_field = 'id'
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'code']