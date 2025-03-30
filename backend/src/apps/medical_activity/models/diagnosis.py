from django.db import models
from apps import medical_activity


class Diagnosis(models.Model):
    """
    Диагноз
    """
    name = models.CharField(
        max_length=256,
        verbose_name='Название',
    )

    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='Описание'
    )

    code = models.CharField(
        max_length=32,
        blank=True,
        null=True,
        verbose_name='Код'
    )

    category = models.ForeignKey(
        'medical_activity.DiagnosisCategory',
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        verbose_name='Категория'
    )

    synonym = models.TextField(
        blank=True,
        null=True,
        verbose_name='Синонимы'
    )

    date_created = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )

    date_updated = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления'
    )

    class Meta:
        verbose_name = 'Диагноз'
        verbose_name_plural = verbose_name + 'ы'

    def __str__(self):
        return self.name

