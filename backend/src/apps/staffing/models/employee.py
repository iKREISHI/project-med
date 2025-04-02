from django.db import models
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError

from apps.abstract_models.person import AbstractPersonModel
from .position import Position
from apps.staffing.validators.employee import (
    validate_appointment_duration,
    validate_short_description
)


class Employee(AbstractPersonModel):
    """
    Модель «Сотрудник». Наследует поля от абстрактной модели «Человек» (AbstractPersonModel).
    """

    user = models.OneToOneField(
        'users.User',
        on_delete=models.SET_NULL,
        related_name='employee_profile',
        verbose_name='Пользователь',
        null=True,
        blank=True,
    )

    department = models.ForeignKey(
        'company_structure.FilialDepartment',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("Подразделение")
    )
    position = models.ForeignKey(
        Position,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("Должность")
    )
    appointment_duration = models.DurationField(
        null=True,
        blank=True,
        verbose_name=_("Длительность приёма")
    )
    short_description = models.TextField(
        null=True,
        blank=True,
        verbose_name=_("Краткое описание")
    )

    specialization = models.ForeignKey(
        'staffing.Specialization',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Специализация')
    )

    telegram_chat_id = models.CharField(
        null=True,
        blank=True,
        verbose_name='Чат ID телеграмма для отправки уведомлений',
        max_length=255,
    )

    class Meta:
        verbose_name = _("Сотрудник")
        verbose_name_plural = _("Сотрудники")

    def __str__(self):
        return f"Сотрудник {self.get_full_name()}"

    def clean(self):
        super().clean()

        try:
            validate_appointment_duration(self.appointment_duration)
        except ValidationError as error:
            raise ValidationError({'appointment_duration': error})

        try:
            validate_short_description(self.short_description)
        except ValidationError as error:
            raise ValidationError({'short_description': error})

