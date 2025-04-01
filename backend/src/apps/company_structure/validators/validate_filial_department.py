from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import re

from apps.company_structure.models import FilialDepartment
from apps.company_structure.models.model.filial import Filial
from apps.staffing.models import Employee


def validate_department_create(data: dict) -> None:
    """
    Комплексная валидация данных для создания подразделения
    """
    # Валидация названия
    name = data.get('name')
    if not name:
        raise ValidationError(_("Обязательное поле: название подразделения"))

    validate_department_name(name)

    # Валидация филиала (если указан)
    filial_id = data.get('filial')
    if filial_id:
        try:
            Filial.objects.get(id=filial_id)
        except Filial.DoesNotExist:
            raise ValidationError(_("Указанный филиал не существует"))

def validate_department_name(name: str) -> None:
    """
    Валидация названия подразделения:
    - Длина от 3 до 255 символов
    - Только буквы, цифры и основные символы
    """

    if len(name) < 3:
        raise ValidationError(_("Название должно содержать минимум 3 символа"))

    if len(name) > 255:
        raise ValidationError(_("Название не может превышать 255 символов"))

    if not re.match(r'^[А-Яа-яA-Za-z0-9\s\-"()/№#&]+$', name):
        raise ValidationError(_("Допустимы буквы, цифры и символы: -\"()/№#&"))