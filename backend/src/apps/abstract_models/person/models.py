from django.core.validators import RegexValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from .validators import (
    validate_last_name, validate_first_name, validate_patronymic,
    validate_gender, validate_date_of_birth, validate_snils,
    validate_inn, validate_photo_size, validate_phone, validate_address
)


class AbstractPersonModel(models.Model):
    last_name = models.CharField(
        max_length=150,
        verbose_name=_("Фамилия"),
        validators=[validate_last_name],
    )
    first_name = models.CharField(
        max_length=150,
        verbose_name=_("Имя"),
        validators=[validate_first_name],
    )
    patronymic = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        verbose_name=_("Отчество"),
        validators=[validate_patronymic],
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
        verbose_name=_("Пол"),
        validators=[validate_gender],
    )

    date_of_birth = models.DateField(
        blank=True,
        null=True,
        verbose_name=_("Дата рождения"),
        validators=[validate_date_of_birth],
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
        validators=[validate_snils],
        help_text=_("Укажите СНИЛС в формате 123-456-789 01 или 12345678901")
    )
    inn = models.CharField(
        max_length=12,
        blank=True,
        null=True,
        verbose_name=_("ИНН"),
        validators=[validate_inn],
    )

    passport_series = models.CharField(
        max_length=4,
        blank=True,
        null=True,
        verbose_name=_("Серия паспорта"),
        validators=[
            RegexValidator(
                regex=r'^\d{4}$',
                message=_("Серия паспорта должна состоять ровно из 4 цифр")
            )
        ]
    )

    passport_number = models.CharField(
        max_length=6,
        blank=True,
        null=True,
        verbose_name=_("Номер паспорта"),
        validators=[
            RegexValidator(
                regex=r'^\d{6}$',
                message=_("Номер паспорта должен состоять ровно из 6 цифр")
            )
        ]
    )

    photo = models.ImageField(
        upload_to="photos/",
        blank=True,
        null=True,
        verbose_name=_("Фото"),
        validators=[validate_photo_size],
    )

    registration_address = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Адрес регистрации"),
        validators=[validate_address],
    )
    actual_address = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("Адрес фактического проживания"),
        validators=[validate_address],
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
        verbose_name=_("Номер телефона"),
        validators=[validate_phone],
    )

    class Meta:
        abstract = True
        verbose_name = _("Человек (абстрактный)")
        verbose_name_plural = _("Люди (абстрактные)")

    def __str__(self):
        return f"{self.last_name} {self.first_name}".strip()

    def get_full_name(self):
        parts = [self.last_name, self.first_name, self.patronymic]
        return " ".join(filter(None, parts))
