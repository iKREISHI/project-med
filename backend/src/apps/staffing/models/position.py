from django.contrib.auth.models import Permission, Group
from django.db import models
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError

from apps.staffing.validators.position import (
    validate_position_name,
    validate_position_short_name
)


class Position(models.Model):
    """
    Модель «Должность».
    """

    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        verbose_name=_("Группа доступа"),
        null=True,
        blank=True,
        related_name='permission_group',
    )

    name = models.CharField(
        max_length=255,
        verbose_name=_("Наименование должности")
    )

    short_name = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_("Наименование сокращённое")
    )

    # TODO: поменять на ForeignKey
    minzdrav_position = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Должность Минздрава")
    )

    class Meta:
        verbose_name = _("Должность")
        verbose_name_plural = _("Должности")

    def __str__(self):
        return self.name

    def get_short_name(self):
        return self.short_name

    def clean(self):
        super().clean()

        try:
            validate_position_name(self.name)
        except ValidationError as error:
            raise ValidationError({'name': error})

        try:
            validate_position_short_name(self.short_name)
        except ValidationError as error:
            raise ValidationError({'short_name': error})
