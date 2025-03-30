from django.core.exceptions import ValidationError
from django.test import TestCase

from apps.staffing.validators import (
    validate_position_name,
    validate_position_short_name
)

class PositionValidatorsTestCase(TestCase):

    # Тесты для validate_position_name
    def test_validate_position_name_valid(self):
        """Проверяем, что корректные наименования не вызывают ошибку."""
        valid_names = [
            "Doctor",
            "  Surgeon  ",
            "ABC",       # ровно 3 символа после trim
            "  XYZ  ",
        ]
        for name in valid_names:
            try:
                validate_position_name(name)
            except ValidationError:
                self.fail(f"validate_position_name raised ValidationError for valid input '{name}'")

    def test_validate_position_name_empty(self):
        """Пустая строка или строка, состоящая только из пробелов, должна вызывать ошибку."""
        invalid_names = [
            "",
            "   ",
        ]
        for name in invalid_names:
            with self.assertRaises(ValidationError) as cm:
                validate_position_name(name)
            self.assertIn("обязательно", str(cm.exception))

    def test_validate_position_name_too_short(self):
        """Наименование, длина которого после удаления пробелов меньше 3, должно вызывать ошибку."""
        invalid_names = [
            "ab",
            "  xy  ",
        ]
        for name in invalid_names:
            with self.assertRaises(ValidationError) as cm:
                validate_position_name(name)
            self.assertIn("не менее 3 символов", str(cm.exception))

    # Тесты для validate_position_short_name
    def test_validate_position_short_name_valid(self):
        """
        Если значение не задано или длина (после удаления пробелов) не менее 2 символов,
        валидатор не должен выбрасывать ошибку.
        """
        valid_short_names = [
            "",            # пустая строка не проверяется
            None,          # None также считается отсутствием значения
            "Dr",          # ровно 2 символа
            "  MD  ",      # после trim – "MD"
            "RN"
        ]
        for short_name in valid_short_names:
            try:
                validate_position_short_name(short_name)
            except ValidationError:
                self.fail(f"validate_position_short_name raised ValidationError for valid input '{short_name}'")

    def test_validate_position_short_name_too_short(self):
        """Если значение задано, но его длина после удаления пробелов меньше 2 символов, должна быть ошибка."""
        invalid_short_names = [
            "A",
            "  X ",
        ]
        for short_name in invalid_short_names:
            with self.assertRaises(ValidationError) as cm:
                validate_position_short_name(short_name)
            self.assertIn("не менее 2 символов", str(cm.exception))
