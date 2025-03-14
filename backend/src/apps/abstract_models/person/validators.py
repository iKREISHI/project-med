import re
from datetime import date
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_only_letters(value: str, field_name: str = '') -> None:
    """
    Универсальный валидатор для проверки, что строка содержит только буквы (кириллица, латиница).
    """
    if value and not re.match(r'^[a-zA-Zа-яА-ЯёЁ]+$', value):
        raise ValidationError(
            _(f"{field_name} должно содержать только буквы.")
        )

def validate_last_name(value: str) -> None:
    validate_only_letters(value, field_name=_("Фамилия"))

def validate_first_name(value: str) -> None:
    validate_only_letters(value, field_name=_("Имя"))

def validate_patronymic(value: str) -> None:
    """
    Отчество — необязательное поле. Если заполнено, проверяем, что содержит только буквы.
    """
    if value:
        validate_only_letters(value, field_name=_("Отчество"))

def validate_gender(value: str) -> None:
    """
    Проверяет, что значение пола входит в допустимый набор значений (M, F, U).
    Обычно это не требуется, если используется choices в модели.
    """
    allowed_values = ['M', 'F', 'U']
    if value not in allowed_values:
        raise ValidationError(
            _("Некорректное значение пола. Допустимые варианты: M, F или U.")
        )

def validate_date_of_birth(value) -> None:
    """
    Проверяет, что дата рождения не наступает в будущем.
    """
    if value and value > date.today():
        raise ValidationError(
            _("Дата рождения не может быть в будущем.")
        )

def validate_snils(value: str) -> None:
    """
    Проверяет СНИЛС в одном из двух форматов:
      - 123-456-789 01
      - 12345678901
    """
    if value:
        pattern_with_dashes = r'^\d{3}-\d{3}-\d{3} \d{2}$'
        pattern_without_dashes = r'^\d{11}$'
        if not (re.match(pattern_with_dashes, value) or re.match(pattern_without_dashes, value)):
            raise ValidationError(
                _("Неверный формат СНИЛС. Ожидается '123-456-789 01' или '12345678901'.")
            )

def validate_inn(value: str) -> None:
    """
    Проверяет, что ИНН содержит только цифры и имеет длину 10 или 12 символов.
    """
    if value:
        if not value.isdigit():
            raise ValidationError(_("ИНН должен содержать только цифры."))
        if len(value) not in [10, 12]:
            raise ValidationError(_("ИНН должен содержать 10 или 12 цифр."))

def validate_photo_size(file) -> None:
    """
    Проверяет, что размер загружаемого файла не превышает 2 МБ.
    """
    max_size = 2 * 1024 * 1024  # 2 MB
    if file and hasattr(file, 'size') and file.size > max_size:
        raise ValidationError(
            _("Размер фото не должен превышать 2 МБ.")
        )

def validate_phone(value: str) -> None:
    """
    Проверяет, что номер телефона содержит от 7 до 15 цифр
    и может начинаться со знака "+".
    """
    if value:
        if not re.match(r'^\+?\d{7,15}$', value):
            raise ValidationError(
                _("Некорректный формат номера телефона. "
                  "Ожидается от 7 до 15 цифр с опциональным знаком '+'.")
            )

def validate_address(value: str) -> None:
    """
    Пример простой проверки адреса: длина не менее 5 символов.
    При необходимости логику можно усложнить.
    """
    if value and len(value) < 5:
        raise ValidationError(
            _("Адрес должен содержать не менее 5 символов.")
        )
