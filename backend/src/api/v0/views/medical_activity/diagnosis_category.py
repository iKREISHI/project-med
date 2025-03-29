from rest_framework import viewsets, status
from rest_framework.response import Response
from api.v0.views.abstract import CustomPagination
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from api.v0.permissions.strict_django_model_permissions import StrictDjangoModelPermissions

from apps.medical_activity.models.diagnosis_category import DiagnosisCategory
from apps.medical_activity.serializers.diagnosis_category import DiagnosisCategorySerializer


class DiagnosisCategoryViewSet(viewsets.ModelViewSet):
    queryset = DiagnosisCategory.objects.all()
    serializer_class = DiagnosisCategorySerializer
    pagination_class = CustomPagination
    permission_classes = (IsAuthenticated, DjangoModelPermissions)
    lookup_field = 'id'

