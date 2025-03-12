from django.db import models
from django.utils.translation import gettext_lazy as _


class Position(models.Model):
    """
    Пример модели «Должность».
    """
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