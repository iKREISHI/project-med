from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.abstract_models.electronic_signature.generate_org_signature import generate_org_signature


class AbstractElectronicSignature(models.Model):
    is_signed = models.BooleanField(
        default=False,
        verbose_name=_('Подписано ЭП'),
        blank=True,
        null=True,
    )
    signed_by = models.ForeignKey(
        'staffing.Employee',
        on_delete=models.PROTECT,
        verbose_name=_('Кем подписан'),
        blank=True,
        null=True,
    )
    signed_date = models.DateField(
        auto_now=True,
        verbose_name=_('Дата подписания'),
        blank=True,
        null=True,
    )
    # Поле для хранения организационной подписи в виде текста.
    org_signature = models.TextField(
        verbose_name=_("Организационная подпись"),
        blank=True,
        null=True,
    )

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        # Если документ подписан и подпись ещё не задана, генерируем подпись.
        if self.is_signed and not self.org_signature:
            self.org_signature = generate_org_signature()
        super().save(*args, **kwargs)