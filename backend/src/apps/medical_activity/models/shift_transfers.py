from django.db import models, transaction
from rest_framework import serializers

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
        related_name='shifttransfer_from_set'
    )

    to_shift = models.ForeignKey(
        'medical_activity.Shift',
        on_delete=models.PROTECT,
        verbose_name=_('Другая смена'),
        related_name='shifttransfer_to_set'
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

    def clean(self):
        """Дополнительные проверки перед сохранением"""
        if self.from_shift_id == self.to_shift_id:
            raise serializers.ValidationError({"non_field_errors":_("Нельзя передавать смену самой себе")})

    def save(self, *args, **kwargs):
        # Проверка валидации
        self.full_clean()

        with transaction.atomic():
            # Обновляем версии объектов из базы
            from_shift = Shift.objects.select_for_update().get(pk=self.from_shift_id)
            to_shift = Shift.objects.select_for_update().get(pk=self.to_shift_id)

            if from_shift.doctor_id != self._state.fields_cache.get('from_shift').doctor_id:
                raise serializers.ValidationError({"non_field_errors":_("Данные смены from_shift изменились")})

            # Сохраняем оригинальных врачей
            original_from_doctor = from_shift.doctor
            original_to_doctor = to_shift.doctor

            # Меняем врачей
            from_shift.doctor = original_to_doctor
            to_shift.doctor = original_from_doctor

            # Сохраняем смены
            from_shift.save(update_fields=['doctor'])
            to_shift.save(update_fields=['doctor'])

            # Сохраняем сам объект передачи
            super().save(*args, **kwargs)

    def __str__(self) -> str:
        time = self.date.strftime('%Y-%m-%d %H:%M')
        return f'{self.from_shift} -> {self.to_shift} - {time}'
