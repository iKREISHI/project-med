from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views.auth import (
    LoginViewSet, LogoutViewSet, CurrentUserViewSet
)
from .views.clients import (
    PatientViewSet
)
from .views.medical_activity.doctor_appointment import DoctorAppointmentViewSet
from .views.registration import RegistrationViewSet
from .views.staffing import (
    EmployeeViewSet
)
from .views.registry import (
    MedicalCardViewSet
)
from .views.staffing.position import PositionViewSet

router = DefaultRouter()
router.register('login', LoginViewSet, basename='login')
router.register('logout', LogoutViewSet, basename='logout')
router.register('current-user', CurrentUserViewSet, basename='current-user')
router.register('patient', PatientViewSet, basename='patient')
router.register('employee', EmployeeViewSet, basename='employee')
router.register('medical-card', MedicalCardViewSet, basename='medical-card')
router.register('register-new-employee', RegistrationViewSet, basename='register-new-employee')
router.register(r'appointments', DoctorAppointmentViewSet, basename='doctorappointment')
router.register(r'position', PositionViewSet, basename='position')

urlpatterns = (
[
   path('chat/', include('api.v0.chat.urls'))
] + router.urls)