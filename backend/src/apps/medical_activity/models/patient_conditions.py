from django.db import models
from apps import staffing, medical_activity
from django.utils.translation import gettext_lazy as _
from apps.medical_activity.models.abstract_document_template import AbstractDocumentTemplate


class PatientCondition(AbstractDocumentTemplate):
    """
    Состояние пациента
    """
    patient = models.ForeignKey(
        'clients.Patient',
        on_delete=models.PROTECT,
        verbose_name=_('Пациент')
    )

    shift = models.ForeignKey(
        'medical_activity.Shift',
        on_delete=models.PROTECT,
        verbose_name=_('Врачебная смена')
    )

    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Описание состояния пациента')
    )

    date = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('дата')
    )

    STATUS_CHOICES = {
        'Critical': 'Критическое',
        'Worsening': 'Ухудшение',
        'Stable': 'Стабильное',
        'Improving': 'Улучшение',
        'Recovering': 'Выздоровление',
        'Post-operative': 'Послеоперационное',
        'Unstable': 'Неустойчивое',
        'No change': 'Без изменений'
    }

    status = models.CharField(
        choices=STATUS_CHOICES,
        max_length=64,
        verbose_name=_('Статус состояния пацента')
    )

    class Meta:
        verbose_name = 'Состояние пациента'
        verbose_name_plural = 'Состояния пациентов'

    def __str__(self) -> str:
        return f'{self.patient.get_short_name()} - {self.status} - {self.date.strftime("%Y-%m-%d %H:%M")}'