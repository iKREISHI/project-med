from django.db import models
from django.utils.translation import gettext_lazy as _


class AbstractDocumentTemplate(models.Model):
    """
    Абстрактная модель с полями:
        - ссылка на шаблон документа;
        - документ;
        - поля документа.
    """
    document_template = models.ForeignKey(
        'medical_activity.ReceptionTemplate',
        on_delete=models.PROTECT,
        verbose_name=_('Шаблон документа'),
        blank=True,
        null=True,
    )

    document = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Документ смены')
    )

    document_fields = models.JSONField(
        blank=True,
        null=True,
        verbose_name=_('Поля документа')
    )

    class Meta:
        abstract = True