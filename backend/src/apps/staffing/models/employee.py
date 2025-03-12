from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.abstract_models.person import AbstractPersonModel
from .position import Position


class Employee(AbstractPersonModel):
    """
    Модель «Сотрудник». Наследует поля от абстрактной модели «Человек» (AbstractPersonModel).
    """
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
