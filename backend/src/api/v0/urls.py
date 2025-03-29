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
from .views.medical_activity.shifts import ShiftViewSet
from .views.registration import RegistrationViewSet
from .views.staffing import (
    EmployeeViewSet, SpecializationViewSet
)
from .views.registry import (
    MedicalCardViewSet,
    MedicalCardTypeViewSet
)
from .views.staffing.position import PositionViewSet
from .views.staffing.reception_time import ReceptionTimeViewSet
from .views.medical_activity.reception_template import ReceptionTemplateViewSet
from .views.medical_activity.shift_transfers import ShiftTransferViewSet
from .views.medical_activity.patient_conditions import PatientConditionViewSet
from .views.medical_activity.hospital_stays import HospitalStaysViewSet
from api.v0.views.medical_activity.diagnosis import DiagnosisViewSet
from api.v0.views.medical_activity.diagnosis_category import DiagnosisCategoryViewSet
from api.v0.views.medical_activity.booking_appointment import BookingAppointmentViewSet
from api.v0.views.auth.permission_group import GetGroupAndPermissions4CurrentUser

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
router.register('specialization', SpecializationViewSet, basename='specialization')
router.register(r'reception-templates', ReceptionTemplateViewSet, basename='receptiontemplate')
router.register(r'shift', ShiftViewSet, basename='shift')
router.register(r'shift-transfers', ShiftTransferViewSet, basename='shifttransfer')
router.register(r'patient-conditions', PatientConditionViewSet, basename='patientcondition')
router.register(r'hospital-stays', HospitalStaysViewSet, basename='hospitalstays')
router.register(r'diagnoses', DiagnosisViewSet, basename='diagnosis')
router.register(r'diagnosis-categories', DiagnosisCategoryViewSet, basename='diagnosiscategory')
router.register(r'booking-appointments', BookingAppointmentViewSet, basename='bookingappointment')
router.register(r'permission-group-current-user', GetGroupAndPermissions4CurrentUser, basename='permission-group-current-user')


urlpatterns = (
[
   path('chat/', include('api.v0.chat.urls'))
] + router.urls)