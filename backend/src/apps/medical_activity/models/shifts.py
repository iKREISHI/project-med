from django.db import models
from django.utils import timezone
from rest_framework.serializers import ValidationError
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
            start = self.start_time.strftime('%Y-%m-%d %H:%M')
            end = self.end_time.strftime('%Y-%m-%d %H:%M')
            doctor = self.doctor.get_short_name()
            return f'{doctor} {start} - {end}'

    def clean(self):
        if self.start_time > timezone.now():
            raise ValidationError({'start_time': _('Время начала не может быть позже текущего времени')})

        if self.start_time >= self.end_time:
            raise ValidationError({'start_time': _('Время начала должно быть раньше времени окончания')})

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)