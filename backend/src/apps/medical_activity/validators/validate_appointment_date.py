from rest_framework.exceptions import ValidationError

from apps.staffing.models import Employee, ReceptionTime
from django.utils.translation import gettext_lazy as _

def validate_doctor_appointment_datetime(appointment):
    """
    Валидация времени приема врача:
    1. Проверка что врач работает в указанное время
    2. Проверка корректности временного интервала
    """

    if not appointment.assigned_doctor or not appointment.appointment_date:
        raise ValidationError({"assigned_doctor":_("Обязательные поля: врач и дата приёма")})

    if appointment.start_time >= appointment.end_time:
        raise ValidationError({"non_field_errors":_("Время окончания приёма должно быть позже времени начала")})

    # Поиск рабочих часов врача
    reception_times = ReceptionTime.objects.filter(
        doctor=appointment.assigned_doctor,
        reception_day=appointment.appointment_date
    )

    if not reception_times.exists():
        raise ValidationError({"non_field_errors":_("Врач не работает в указанную дату")})

    time_is_valid = any(
        rt.start_time <= appointment.start_time
        and rt.end_time >= appointment.end_time
        for rt in reception_times
    )

    if not time_is_valid:
        raise ValidationError({"non_field_errors":_("Время приёма выходит за рамки рабочего графика врача")})


