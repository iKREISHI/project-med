from django.db import models
from apps import staffing, medical_activity
from django.utils.translation import gettext_lazy as _
from apps.medical_activity.models.abstract_document_template import AbstractDocumentTemplate


class Shift(AbstractDocumentTemplate):
    """
    Врачебная смена

    Смена привязана к одному основному врачу, который в конкретный период несёт дежурство.
    """

    doctor = models.ForeignKey(
        'staffing.Employee',
        on_delete=models.PROTECT,
        verbose_name=_('Врач'),
    )

    start_time = models.DateTimeField(
        auto_now=False,
        verbose_name=_('Время начала смены')
    )

    end_time = models.DateTimeField(
        auto_now=False,
        verbose_name=_('Время окончания смены')
    )

    class Meta:
        verbose_name = 'Врачебная смена'
        verbose_name_plural = 'Врачебные смены'

    def __str__(self) -> str:
        # Человеко читаемое название врачебной смены
        start = self.start_time.strftime('%Y-%m-%d %H:%M')
        end = self.end_time.strftime('%Y-%m-%d %H:%M')
        doctor = self.doctor.get_short_name()
        return f'{doctor} {start} - {end}'