from django.db import models
from django.utils.translation import gettext_lazy as _


class Specialization(models.Model):
    """
    Специализация врача (доктора)
    """
    title = models.CharField(
        max_length=100,
        verbose_name=_('Название специализации')
    )

    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Описание специализации')
    )

    class Meta:
        verbose_name = 'Специализация врача'
        verbose_name_plural = 'Специализации врачей'
