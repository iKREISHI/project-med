import uuid
from django.db import models
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _

from apps.abstract_models.electronic_signature.generate_org_signature import generate_org_signature
from apps.abstract_models.electronic_signature.models import AbstractElectronicSignature


class Prescription(AbstractElectronicSignature):
    """
    Модель для хранения информации о рецептах на лекарства.
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        verbose_name=_("Уникальный идентификатор (localUid)")
    )

    system = models.CharField(
        max_length=255,
        verbose_name=_("Система"),
        default="test"
    )

    # document_number генерируется как строка
    document_number = models.CharField(
        max_length=255,
        unique=True,
        verbose_name=_("Номер документа"),
        default='',
    )

    patient = models.ForeignKey(
        'clients.Patient',
        on_delete=models.PROTECT,
        verbose_name=_("Пациент"),
        related_name="prescriptions"
    )

    description = models.TextField(
        verbose_name=_("Описание"),
        blank=True,
        null=True,
        default='Выписанный рецепт'
    )

    doc_content = models.TextField(
        verbose_name=_("Содержимое документа (HTML)"),
        blank=True,
        null=True
    )

    is_send = models.BooleanField(
        verbose_name='Отправлено ли на API аптеки',
        default=False,
    )

    date_created = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания"
    )

    def save(self, *args, **kwargs):
        if self.is_signed and not self.org_signature:
            self.org_signature = generate_org_signature()

        if not self.document_number:
            self.document_number = str(uuid.uuid4())
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = _("Рецепт")
        verbose_name_plural = _("Рецепты")