from django.db import models
from apps import staffing, medical_activity
from django.utils.translation import gettext_lazy as _
from apps.medical_activity.models.abstract_document_template import AbstractDocumentTemplate


class HospitalStays(AbstractDocumentTemplate):
    """
    Госпитализация
    """

    patient = models.ForeignKey(
        'clients.Patient',
        on_delete=models.PROTECT,
        verbose_name=_('Пациент')
    )

    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Описание')
    )

    start_date = models.DateField(
        verbose_name=_('Дата госпитализации')
    )

    end_date = models.DateField(
        verbose_name=_('Дата выписки')
    )

    ward_number = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        verbose_name=_('Номер палаты')
    )

    appointment = models.ForeignKey(
        'medical_activity.DoctorAppointment',
        on_delete=models.PROTECT,
        verbose_name=_('Прием')
    )

    class Meta:
        verbose_name = _('Госпитализация')
        verbose_name_plural = _('Госпитализации')

    def __str__(self) -> str:
        patient = self.patient.get_short_name()
        date = self.start_date.strftime('%Y-%m-%d')
        return f'{patient} - {date} - {self.ward_number}'