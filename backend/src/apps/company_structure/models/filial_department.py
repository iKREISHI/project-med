import re
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError


class FilialDepartment(models.Model):
    """
    Отделения (подразделения)
    """
    name = models.CharField(
        max_length=255,
        verbose_name=_("Название отделения")
    )
    director = models.ForeignKey(
        'staffing.Employee',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("Руководитель"),
        related_name='managed_departments'
    )
    filial = models.ForeignKey(
        'company_structure.Filial',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("Филиал")
    )

    class Meta:
        verbose_name = _('Отделение филиала')
        verbose_name_plural = _('Отделения филиала')
        unique_together = (('filial', 'name'),)

    def __str__(self):
        return self.name

    def clean(self):
        super().clean()
        # Валидация: название должно быть минимум 2 символа
        if self.name and len(self.name) < 2:
            raise ValidationError({'name': 'Слишком короткое название'})
        # Допустимы только буквы, пробелы и дефисы
        if self.name and not re.match(r'^[А-Яа-яЁё\s-]+$', self.name):
            raise ValidationError({'name': 'Недопустимые символы в названии'})
        # Если назначен директор, то у него должно быть установлено подразделение, и оно должно совпадать с текущим
        # Проверка уникальности (unique_together)
        self.validate_unique()
