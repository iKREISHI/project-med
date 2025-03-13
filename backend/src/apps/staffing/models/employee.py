from django.db import models
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError

from apps.abstract_models.person import AbstractPersonModel
from .position import Position
from apps.staffing.validators.employee import (
    validate_appointment_duration,
    validate_short_description
)
import uuid


class Employee(AbstractPersonModel):
    """
    Модель «Сотрудник». Наследует поля от абстрактной модели «Человек» (AbstractPersonModel).
    """
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    # TODO: поменять на ForeignKey
    department = models.CharField(
        # on_delete=models.SET_NULL,
        max_length=128,
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

