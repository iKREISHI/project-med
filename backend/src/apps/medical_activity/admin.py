from django.contrib import admin
from .models import DoctorAppointment

@admin.register(DoctorAppointment)
class DoctorAppointmentAdmin(admin.ModelAdmin):
    list_display = (
        'patient',
        'assigned_doctor',
        'date_created',
        'inspection_choice',
        'is_closed',
        'is_signed',
        'appointment_date',
        'start_time',
        'end_time',
    )
    list_filter = (
        'is_closed',
        'inspection_choice',
        'is_first_appointment',
        'is_signed',
        'date_created',
    )
    search_fields = (
        'patient__id',          # При наличии у модели Patient соответствующих полей можно заменить на 'patient__first_name', 'patient__last_name'
        'assigned_doctor__id',    # Аналогично для модели Employee
        'reason_for_inspection',
    )
