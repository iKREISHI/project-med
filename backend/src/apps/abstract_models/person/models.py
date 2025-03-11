from django.db import models
from django.utils.translation import gettext_lazy as _


class AbstractPersonModel(models.Model):
    """
    Абстрактная модель человека. Не может быть использована напрямую,
    но может служить родительской для других моделей (например, Пациент, Врач).
    """

    # Поля
    last_name = models.CharField(
        max_length=150,
        verbose_name=_("Фамилия")
    )
    first_name = models.CharField(
        max_length=150,
        verbose_name=_("Имя")
    )
    patronymic = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        verbose_name=_("Отчество")
    )

    GENDER_CHOICES = [
        ('M', _("Мужской")),
        ('F', _("Женский")),
        ('U', _("Не указан")),
    ]
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        default='U',
        verbose_name=_("Пол")
    )

    date_of_birth = models.DateField(
        blank=True,
        null=True,
        verbose_name=_("Дата рождения")
    )
    date_created = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Дата создания")
    )

    snils = models.CharField(
        max_length=14,
        blank=True,
        null=True,
        verbose_name=_("СНИЛС"),
        help_text=_("Укажите СНИЛС в формате 123-456-789 01 или 12345678901")
    )
    inn = models.CharField(
        max_length=12,
        blank=True,
        null=True,
        verbose_name=_("ИНН")
    )

    photo = models.ImageField(
        upload_to="photos/",
        blank=True,
        null=True,
        verbose_name=_("Фото")
    )

    registration_address = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Адрес регистрации")
    )
    actual_address = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Адрес фактического проживания")
    )

    email = models.EmailField(
        blank=True,
        null=True,
        verbose_name=_("Почта")
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name=_("Номер телефона")
    )

    class Meta:
        abstract = True
        verbose_name = _("Человек (абстрактный)")
        verbose_name_plural = _("Люди (абстрактные)")

    def __str__(self):
        """Удобное представление объекта (фамилия и имя)."""
        return f"{self.last_name} {self.first_name}".strip()

    def get_full_name(self):
        """Возвращает полное ФИО."""
        parts = [self.last_name, self.first_name, self.patronymic]
        return " ".join(filter(None, parts))
