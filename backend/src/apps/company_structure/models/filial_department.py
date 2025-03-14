import uuid
from django.db import models


class FilialDepartment(models.Model):
    """
        Подразделение филиала
    """
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    name = models.CharField(
        max_length=255,
        verbose_name='Название подразделения'
    )

    director = models.ForeignKey(
        'staffing.Employee',  # Используем строковую ссылку
        on_delete=models.SET_NULL,
        verbose_name='Руководитель',
        null=True,
        blank=True,
        related_name='managed_departments'
    )

    filial = models.ForeignKey(
        'company_structure.Filial',
        on_delete=models.SET_NULL,
        verbose_name='Филиал',
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = 'Подразделение филиала'
        verbose_name_plural = 'Подразделения филиала'

    def __str__(self):
        return f"{self.name}"

