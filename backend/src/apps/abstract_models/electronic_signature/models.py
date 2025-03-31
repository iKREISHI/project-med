from django.db import models
from django.utils.translation import gettext_lazy as _


class AbstractElectronicSignature(models.Model):
    is_signed = models.BooleanField(
        default=False,
        verbose_name=_('Подписано ЭП'),
        blank=True,
        null=True,
    )

    signed_by = models.ForeignKey(
        'staffing.Employee',
        on_delete=models.PROTECT,
        verbose_name=_('Кем подписан'),
        blank=True,
        null=True,
    )

    signed_date = models.DateField(
        auto_now=True,
        verbose_name=_('Дата подписания'),
        blank=True,
        null=True,
    )

    class Meta:
        abstract = True