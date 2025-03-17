from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid

from apps.abstract_models.electronic_signature.models import AbstractElectronicSignature


class MedicalCard(AbstractElectronicSignature):
    """
    Медицинская карта
    """

    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    client = models.ForeignKey(
        'clients.Patient',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Пациент',
        related_name='medical_cards'
    )

    card_type = models.CharField(
        max_length=20,
        verbose_name='Тип карты'
    )

    date_created = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата регистрации'
    )

    comment = models.TextField(
        blank=True,
        null=True,
        verbose_name='Комментарий'
    )

    filial = models.ForeignKey(
        'company_structure.Filial',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Филиал'
    )


    class Meta:
        verbose_name = "Медицинская карта"
        verbose_name_plural = "Медицинские карты"

    def __str__(self):
        return f"Мед. карта {self.client} ({self.get_card_type_display()})"