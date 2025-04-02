from typing import Dict


def validate_filial_create(data: Dict[str, str, str, str | None]):
    city = data.get('city')
    validate_filial_city(city)

    street = data.get('street')
    validate_filial_street(street)

    house = data.get('house')
    validate_filial_house(house)

    building = data.get('building')
    validate_filial_building(building)

    return data


import re
from django.core.exceptions import ValidationError


def validate_filial_city(city: str) -> None:
    pattern = r'^[А-Яа-яA-Za-z\s-]+$'
    if not re.fullmatch(pattern, city):
        raise ValidationError(
            "Название города может содержать только буквы, пробелы и дефис. Пример: 'Москва', 'Ростов-на-Дону'"
        )


def validate_filial_street(street: str) -> None:
    pattern = r'^[А-Яа-яA-Za-z\s-]+$'
    if not re.fullmatch(pattern, street):
        raise ValidationError(
            "Название улицы может содержать только буквы, пробелы и дефис. Пример: 'Ленина', 'Центральная'"
        )


def validate_filial_house(house: str) -> None:
    pattern = r'^[А-Яа-яA-Za-z0-9-]+$'
    if not re.fullmatch(pattern, house):
        raise ValidationError(
            "Номер дома может содержать только буквы, цифры и дефис. Пример: '15А', '34-Б'"
        )


def validate_filial_building(building: str) -> None:
    if not building:
        return

    pattern = r'^[А-Яа-яA-Za-z0-9-]+$'
    if not re.fullmatch(pattern, building):
        raise ValidationError(
            "Корпус/строение может содержать только буквы, цифры и дефис. Пример: '2А', '3-1'"
        )