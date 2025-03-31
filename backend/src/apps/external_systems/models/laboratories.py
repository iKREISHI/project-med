from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid

from apps.clients.models import Patient


class Laboratory(models.Model):
    """Модель лаборатории"""
    guid = models.UUIDField(
        _("Уникальный идентификатор лаборатории"),
        default=uuid.uuid4,
        editable=False,
        unique=True
    )
    name = models.CharField(
        _("Название лаборатории"),
        max_length=255
    )
    address = models.CharField(
        _("Адрес лаборатории"),
        max_length=255
    )

    class Meta:
        verbose_name = _("Лаборатория")
        verbose_name_plural = _("Лаборатории")

    def __str__(self):
        return f"{self.name} ({self.address})"

class LaboratoryResearch(models.Model):
    """Модель лабораторного исследования"""
    STATUS_CHOICES = [
        ('completed', _('Завершено')),
        ('process', _('В процессе')),
    ]

    lab_direction_guid = models.UUIDField(
        _("GUID направления"),
        default=uuid.uuid4,
        unique=True,
        editable=False
    )
    status = models.CharField(
        _("Статус исследования"),
        max_length=20,
        choices=STATUS_CHOICES
    )
    number = models.CharField(
        _("Номер документа"),
        max_length=50
    )
    create_date = models.DateTimeField(
        _("Дата создания")
    )
    direction_date = models.DateTimeField(
        _("Дата направления")
    )
    previous_research_guid = models.UUIDField(
        _("GUID предыдущего исследования"),
        null=True,
        blank=True
    )
    is_previous_research = models.BooleanField(
        _("Предыдущее исследование выполнено"),
        default=False
    )
    is_priority = models.BooleanField(
        _("Приоритетное исследование (CITO)"),
        default=False
    )
    patient = models.ForeignKey(
        Patient,
        on_delete=models.SET_NULL,
        verbose_name=_("Пациент"),
        null=True,
        blank=True
    )

    laboratory = models.ForeignKey(
        Laboratory,
        on_delete=models.CASCADE,
        verbose_name=_("Лаборатория")
    )

    class Meta:
        verbose_name = _("Лабораторное исследование")
        verbose_name_plural = _("Лабораторные исследования")
        indexes = [
            models.Index(fields=['lab_direction_guid']),
            models.Index(fields=['patient']),
        ]

    def __str__(self):
        return f"Исследование №{self.number} от {self.create_date}"

class LaboratoryResearchPDF(models.Model):
    """Модель для хранения PDF-отчетов"""
    research = models.OneToOneField(
        LaboratoryResearch,
        on_delete=models.CASCADE,
        related_name='pdf_report',
        to_field='lab_direction_guid'
    )
    pdf_data = models.BinaryField(
        _("PDF-документ"),
        editable=False
    )
    created_at = models.DateTimeField(
        _("Дата создания документа"),
        auto_now_add=True
    )

    class Meta:
        verbose_name = _("PDF отчет исследования")
        verbose_name_plural = _("PDF отчеты исследований")

    def __str__(self):
        return f"PDF отчета {self.research.lab_direction_guid}"