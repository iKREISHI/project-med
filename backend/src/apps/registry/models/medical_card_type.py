from django.db import models
from django.utils.translation import gettext_lazy as _


class MedicalCardType(models.Model):
    """
    Типы мед.карт
    """

    name = models.CharField(
        max_length=255,
        unique=True,
        verbose_name=_('Название')
    )

    suffix = models.CharField(
        max_length=16,
        null=True,
        blank=True,
        verbose_name=_('Суффикс номера карты')
    )

    prefix = models.CharField(
        max_length=16,
        null=True,
        blank=True,
        verbose_name=_('Префикс номера карты')
    )

    begin_number = models.CharField(
        max_length=16,
        null=True,
        blank=True,
        verbose_name=_('Начальный номер')
    )

    description = models.TextField(
        null=True,
        blank=True,
        verbose_name=_('Описание')
    )

    class Meta:
        verbose_name = _('Тип мед.карты')
        verbose_name_plural = _('Типы мед.карты')

    def __str__(self):
        return self.name