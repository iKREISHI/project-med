from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views.auth import (
    LoginViewSet, LogoutViewSet, CurrentUserViewSet
)
from .views.auth.users import UsersViewSet
from .views.clients import (
    PatientViewSet
)
from .views.clients.contractor import ContractorViewSet
from .views.company_structure.filial import FilialViewSet
from .views.company_structure.filial_department import FilialDepartmentViewSet
from .views.medical_activity.doctor_appointment import DoctorAppointmentViewSet
from .views.registration import RegistrationViewSet
from .views.staffing import (
    EmployeeViewSet
)
from .views.registry import (
    MedicalCardViewSet,
    MedicalCardTypeViewSet
)
from .views.staffing.position import PositionViewSet
from .views.staffing.reception_time import ReceptionTimeViewSet

router = DefaultRouter()
router.register('login', LoginViewSet, basename='login')
router.register('logout', LogoutViewSet, basename='logout')
router.register('current-user', CurrentUserViewSet, basename='current-user')
router.register('users', UsersViewSet, basename='users')
router.register('patient', PatientViewSet, basename='patient')
router.register('employee', EmployeeViewSet, basename='employee')
router.register('medical-card', MedicalCardViewSet, basename='medical-card')
router.register('register-new-employee', RegistrationViewSet, basename='register-new-employee')
router.register(r'appointments', DoctorAppointmentViewSet, basename='doctorappointment')
router.register(r'position', PositionViewSet, basename='position')
router.register(r'reception-time', ReceptionTimeViewSet, basename='reception-time')
router.register(r'filial', FilialViewSet, basename='filial')
router.register(r'filial-departments', FilialDepartmentViewSet, basename='filialdepartment')
router.register(r'contractor', ContractorViewSet, basename='contractor')
router.register(r'medical-card-types', MedicalCardTypeViewSet, basename='medical-card-type')

urlpatterns = (
[
   path('chat/', include('api.v0.chat.urls'))
] + router.urls)