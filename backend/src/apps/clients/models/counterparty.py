from django.db import models
from django.utils.translation import gettext_lazy as _


class Contractor(models.Model):
    """
    Модель «Контрагент».
    """

    full_name = models.CharField(
        max_length=255,
        verbose_name=_("Полное наименование")
    )
    inn = models.CharField(
        max_length=12,
        verbose_name=_("ИНН"),
        help_text=_("Введите 10 или 12 цифр ИНН")
    )
    kpp = models.CharField(
        max_length=9,
        blank=True,
        null=True,
        verbose_name=_("КПП")
    )
    bank_account = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name=_("Основной банковский счёт")
    )
    economic_activity_type = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Вид экономической деятельности")
    )
    ownership_form = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Форма собственности")
    )
    insurance_organization = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Страховая организация")
    )

    class Meta:
        verbose_name = _("Контрагент")
        verbose_name_plural = _("Контрагенты")

    def __str__(self):
        return self.full_name
