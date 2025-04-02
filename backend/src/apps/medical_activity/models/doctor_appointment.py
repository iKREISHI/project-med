from django.db import models
from django.utils.translation import gettext_lazy as _
from django.db.models import SET_NULL
from rest_framework.serializers import ValidationError
from apps.abstract_models.electronic_signature.models import AbstractElectronicSignature
from apps.clients.models import Patient

from apps.staffing.models import ReceptionTime


class DoctorAppointment(AbstractElectronicSignature):
    """
    Прием к врачу
    """
    booking_appointment = models.ForeignKey(
        'medical_activity.BookingAppointment',
        on_delete=models.PROTECT,
        verbose_name='Запись на прием',
        blank=True,
        null=True,
    )

    patient = models.ForeignKey(
        Patient,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Пациент',
        help_text='Внешний ключ на пациента направленного на приём'
    )

    reception_template = models.ForeignKey(
        'medical_activity.ReceptionTemplate',
        on_delete=models.PROTECT,
        verbose_name=_('Шаблон приема'),
        blank=True,
        null=True,
    )

    reception_document = models.TextField(
        null=True,
        blank=True,
        verbose_name=_('Документ приема')
    )

    reception_document_fields = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_('Поля документа')
    )

    assigned_doctor = models.ForeignKey(
        'staffing.Employee',
        verbose_name='Назначенный врач',
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        help_text='Внешний ключ на врача, к которому был записан пациент',
        related_name='doctorappointment_assigned'
    )

    signed_by = models.ForeignKey(
        'staffing.Employee',
        on_delete=models.PROTECT,
        verbose_name='Кем подписан',
        related_name='doctorappointment_signed',
        blank=True,
        null=True,
    )

    is_first_appointment = models.BooleanField(
        default=True,
        verbose_name='Флаг первого приема',
        help_text='Флаг, означающий, что это первичный прием пациента'
    )

    is_closed = models.BooleanField(
        default=False,
        verbose_name='Приём закрыт',
        help_text='Флаг, указывающий, что приём закрыт'
    )

    reason_for_inspection = models.TextField(
        blank=True,
        null=True,
        verbose_name='Основание направления на обследование',
        help_text='Основание направления (основание должны быть по документам)',
    )

    INSPECTION_CHOICES = (
        ('no_inspection', 'Не нуждается в обследовании'),
        ('additional', 'Нуждается в проведении доп обследования'),
        ('center', 'Нуждается в обследовании в центре'),
        ('ambulatory', 'Нуждается в амбулаторном обследовании'),
        ('stationary', 'Нуждается в стационарном обследовании'),
        ('sanatorium', 'Нуждается в санаторно-курортном лечении'),
        ('dispensary', 'Нуждается в диспансерном наблюдении'),
        ('preventive', 'Нуждается в лечебно-профилактических мероприятиях'),
        ('referral', 'Нуждается в направлении на медико-социальную экспертизу'),
    )

    inspection_choice = models.CharField(
        max_length=50,
        choices=INSPECTION_CHOICES,
        default='no_inspection',
        verbose_name='Тип обследования'
    )

    appointment_date = models.DateField(
        verbose_name=_("Дата приема"),
        help_text=_("Укажите дату приема (YYYY-MM-DD)")
    )

    start_time = models.TimeField(
        verbose_name=_("Время начала приема"),
        help_text=_("Время начала приема")
    )

    end_time = models.TimeField(
        verbose_name=_("Время окончания приема"),
        help_text=_("Время окончания приема")
    )

    date_created = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания"
    )

    date_updated = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления'
    )

    medical_card = models.ForeignKey(
        'registry.MedicalCard',
        max_length=255,
        blank=True,
        null=True,
        on_delete=SET_NULL,
    )

    diagnosis = models.ForeignKey(
        'medical_activity.Diagnosis',
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        verbose_name=_('Диагноз')
    )

    def save(self, *args, **kwargs):
        if self.assigned_doctor and self.appointment_date:

            reception_time = ReceptionTime.objects.filter(
                doctor=self.assigned_doctor,
                reception_day=self.appointment_date,
                start_time__lte=self.start_time,
                end_time__gte=self.end_time
            ).exists()

            if not reception_time:
                raise ValidationError({"non_field_errors":_("Время записи не попадает в рабочие часы врача")})

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.patient} - {self.assigned_doctor} ({self.appointment_date} {self.start_time}-{self.end_time})"

    class Meta:
        verbose_name = 'Приём к врачу'
        verbose_name_plural = 'Приёмы к врачу'
