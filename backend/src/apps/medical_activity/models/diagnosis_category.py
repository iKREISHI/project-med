from django.db import models


class DiagnosisCategory(models.Model):
    """
    Категории диагноза
    """
    name = models.CharField(
        max_length=128,
        verbose_name='Название'
    )
    description = models.TextField(
        verbose_name='',
        blank=True,
        null=True
    )

    class Meta:
        verbose_name = 'Категории диагноза'
        verbose_name_plural = 'Категории диагнозов'

    def __str__(self):
        return self.name