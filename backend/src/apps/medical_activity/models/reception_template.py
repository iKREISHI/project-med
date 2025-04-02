from django.db import models
from django.utils.translation import gettext_lazy as _

from apps import staffing


class ReceptionTemplate(models.Model):
    """
    Шаблон приема
    """
    name = models.CharField(
        max_length=100,
        verbose_name=_('Название шаблона')
    )

    description = models.TextField(
        verbose_name=_('Описание шаблона'),
        blank=True,
        null=True,
    )

    html = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Шаблон')
    )

    specialization = models.ForeignKey(
        'staffing.Specialization',
        on_delete=models.PROTECT,
        verbose_name=_('Специализация шаблона')
    )

    fields = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_('Поля приема')
    )

    class Meta:
        verbose_name = 'Шаблон приема'
        verbose_name_plural = 'Шаблоны приемов'