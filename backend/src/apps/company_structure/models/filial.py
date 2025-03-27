from django.db import models


class Filial(models.Model):
    """
        Филиал
    """

    house = models.CharField(
        max_length=255,
        verbose_name='Дом',
    )

    building = models.CharField(
        max_length=255,
        verbose_name='Строение',
        blank=True,
        null=True,
    )

    street = models.CharField(
        max_length=255,
        verbose_name='Улица'
    )

    city = models.CharField(
        max_length=255,
        verbose_name='Город'
    )

    class Meta:
        verbose_name = 'Филиал'
        verbose_name_plural = 'Филиалы'

    def __str__(self):
        return f"Город {self.city} улица {self.street} дом {self.house} {'строение' + self.building if self.building else ''}"