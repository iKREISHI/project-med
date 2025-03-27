from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.abstract_models.electronic_signature.models import AbstractElectronicSignature
from .medical_card_type import MedicalCardType


class MedicalCard(AbstractElectronicSignature):
    """
    Медицинская карта
    """

    name = models.CharField(
        max_length=255,
        verbose_name=_('Наименование')
    )

    number = models.CharField(
        max_length=64,
        verbose_name=_('Номер карты')
    )

    client = models.ForeignKey(
        'clients.Patient',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Пациент'),
        related_name='medical_cards'
    )

    card_type = models.ForeignKey(
        'registry.MedicalCardType',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Тип карты'),
        related_name='medical_card_types'
    )

    date_created = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Дата регистрации')
    )

    date_updated = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Дата обновления'),
        blank=True,
        null=True,
    )

    date_closed = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Дата закрытия')
    )

    comment = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Комментарий')
    )

    filial = models.ForeignKey(
        'company_structure.Filial',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Филиал')
    )

    class Meta:
        verbose_name = _("Медицинская карта")
        verbose_name_plural = _("Медицинские карты")

    def __str__(self):
        return f"Мед. карта {self.client} ({self.number})"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        # Сначала сохраняем объект, чтобы получить его pk
        super().save(*args, **kwargs)
        # Если объект новый и номер карты не задан, формируем его из данных типа карты
        if is_new and not self.number and self.card_type:
            prefix = self.card_type.prefix or ""
            begin_number = self.card_type.begin_number or ""
            suffix = self.card_type.suffix or ""
            self.number = f"{prefix}{begin_number}{self.pk}{suffix}"
            # Сохраняем обновленное значение поля number
            super().save(update_fields=["number"])
        return self
