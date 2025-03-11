from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from apps.abstract_models.person import AbstractPersonModel
from apps.clients.models.counterparty import Contractor  # Импорт модели Контрагент


class Patient(AbstractPersonModel):
    """
    Модель «Пациент». Наследует поля от абстрактной модели «Человек» (AbstractPerson).
    """
    registered_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("Человек, который зарегистрировал пациента")
    )

    contractor = models.ForeignKey(
        Contractor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("Контрагент (работодатель клиента)")
    )
    place_of_work = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Место работы")
    )
    additional_place_of_work = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Дополнительное место работы")
    )
    profession = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Профессия")
    )
    legal_representative = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("Законный представитель")
    )

    class Meta:
        verbose_name = _("Пациент")
        verbose_name_plural = _("Пациенты")

    def __str__(self):
        return f"Пациент {self.get_full_name()}"
