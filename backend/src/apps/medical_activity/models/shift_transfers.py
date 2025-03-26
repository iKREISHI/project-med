from django.db import models
from apps import staffing, medical_activity
from django.utils.translation import gettext_lazy as _

from apps.medical_activity.models.shifts import Shift
from apps.medical_activity.models.abstract_document_template import AbstractDocumentTemplate


class ShiftTransfer(AbstractDocumentTemplate):
    """
    Передача врачебной смены
    """
    from_shift = models.ForeignKey(
        'medical_activity.Shift',
        on_delete=models.PROTECT,
        verbose_name=_('Какая смена передается'),
        related_name='shifttransfer_from_set'  # Уникальное обратное имя для from_shift
    )

    to_shift = models.ForeignKey(
        'medical_activity.Shift',
        on_delete=models.PROTECT,
        verbose_name=_('Другая смена'),
        related_name='shifttransfer_to_set'  # Уникальное обратное имя для to_shift
    )

    date = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Время передачи')
    )

    comment = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Комментарий')
    )

    class Meta:
        verbose_name = 'Передача врачебной смены'
        verbose_name_plural = 'Передача врачебных смен'

    def __str__(self) -> str:
        time = self.date.strftime('%Y-%m-%d %H:%M')
        return f'{self.from_shift} -> {self.to_shift} - {time}'
