from django.urls import path
from rest_framework.routers import DefaultRouter

from .views.auth import (
    LoginViewSet, LogoutViewSet, CurrentUserViewSet
)
from .views.registration import RegistrationViewSet
from .views.clients import (
    PatientViewSet
)
from .views.staffing import (
    EmployeeViewSet
)
from .views.registry import (
    MedicalCardViewSet
)


router = DefaultRouter()
router.register('login', LoginViewSet, basename='login')
router.register('logout', LogoutViewSet, basename='logout')
router.register('registration', RegistrationViewSet, basename='registration')
router.register('current-user', CurrentUserViewSet, basename='current-user')
router.register('patient', PatientViewSet, basename='patient')
router.register('employee', EmployeeViewSet, basename='employee')
router.register('medical-card', MedicalCardViewSet, basename='medical-card')

urlpatterns = router.urls