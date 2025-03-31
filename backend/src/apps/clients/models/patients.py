from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.abstract_models.person import AbstractPersonModel
from apps.clients.models.contractor import Contractor
from apps.clients.validators import (
    validate_place_of_work,
    validate_additional_place_of_work,
    validate_profession,
    validate_legal_representative
)
from config import settings
import uuid


class Patient(AbstractPersonModel):


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
        verbose_name=_("Место работы"),
        validators=[validate_place_of_work]
    )
    additional_place_of_work = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Дополнительное место работы"),
        validators=[validate_additional_place_of_work]
    )
    profession = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Профессия"),
        validators=[validate_profession]
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

    def clean(self):
        """
        Переопределяем метод clean, чтобы проверить, что пациент не является своим собственным законным представителем.
        """
        super().clean()
        validate_legal_representative(self)
