import uuid
from django.db import models
from django.db.models import SET_NULL

from apps.clients.models import Patient
from apps.registry.models import MedicalCard


class DoctorAppointment(models.Model):
    """
    Прием к врачу
    """

    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    patient = models.ForeignKey(
        Patient,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Пациент',
        help_text='Внешний ключ на пациента направленного на приём'
    )

    assigned_doctor = models.ForeignKey(
        'staffing.Employee',
        verbose_name='Назначенный врач',
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        help_text='Внешний ключ на врача к которому был записан пациент'
    )

    # Шаблон осмотра

    is_first_appointment = models.BooleanField(
        default=True,
        verbose_name='Флаг первого приема',
        help_text='Флаг означающий что это первичный прием пациента'
    )

    is_closed = models.BooleanField(
        default=False,
        verbose_name='Приём закрыт',
        help_text='Флаг, того что приём закрыт'
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

    is_signed = models.BooleanField(
        default=False,
        verbose_name='Подписано ЭП'
    )

    date_created = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания"
    )

    medical_card = models.ForeignKey(
        'registry.MedicalCard',
        max_length=255,
        blank=True,
        null=True,
        on_delete=SET_NULL,
    )

    # TODO: Поменять как будет готов врач
    def __str__(self):
        return f"{self.patient} - {self.assigned_doctor} {self.date_created}"

    class Meta:
        verbose_name = 'Приём к врачу'
        verbose_name_plural = 'Приёмы к врачу'