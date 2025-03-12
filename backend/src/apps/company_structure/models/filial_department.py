import uuid
from django.db import models
from apps.company_structure.models.filial import Filial


class FilialDepartment(models.Model):
    """
        Подразделение
    """
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    name = models.CharField(
        max_length=255,
        verbose_name='Название подразделения'
    )

    # TODO: Заменить поле на ключ к сотрудникам
    director = models.CharField(
        max_length='100',
        verbose_name='Руководитель',
    )

    filial = models.ForeignKey(
        Filial,
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

