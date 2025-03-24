from datetime import timedelta
from django.core.exceptions import ValidationError
from django.test import TestCase

from apps.staffing.validators import (
    validate_appointment_duration,
    validate_short_description
)

class ValidatorsTestCase(TestCase):
    # Тесты для validate_appointment_duration
    def test_validate_appointment_duration_with_none(self):
        """Если значение None, валидатор не должен выбрасывать ошибку."""
        try:
            validate_appointment_duration(None)
        except ValidationError:
            self.fail("validate_appointment_duration() raised ValidationError for None input.")

    def test_validate_appointment_duration_with_positive_duration(self):
        """При положительном значении длительности ошибки не должно быть."""
        try:
            validate_appointment_duration(timedelta(minutes=5))
        except ValidationError:
            self.fail("validate_appointment_duration() raised ValidationError for positive duration.")

    def test_validate_appointment_duration_with_zero(self):
        """При нулевой длительности должна быть ошибка."""
        with self.assertRaises(ValidationError) as context:
            validate_appointment_duration(timedelta(0))
        self.assertEqual(
            context.exception.messages,
            ["Длительность приёма должна быть положительной."]
        )

    def test_validate_appointment_duration_with_negative_duration(self):
        """При отрицательной длительности должна быть ошибка."""
        with self.assertRaises(ValidationError) as context:
            validate_appointment_duration(timedelta(minutes=-10))
        self.assertEqual(
            context.exception.messages,
            ["Длительность приёма должна быть положительной."]
        )

    # Тесты для validate_short_description
    def test_validate_short_description_with_valid_description(self):
        """Корректное описание (после strip длина >= 10) не должно вызывать ошибку."""
        valid_desc = "   This description is valid   "  # После strip: "This description is valid"
        try:
            validate_short_description(valid_desc)
        except ValidationError:
            self.fail("validate_short_description() raised ValidationError for a valid description.")

    def test_validate_short_description_with_invalid_description(self):
        """Описание короче 10 символов (после удаления пробелов) должно вызвать ошибку."""
        invalid_desc = "   short   "  # После strip: "short" (5 символов)
        with self.assertRaises(ValidationError) as context:
            validate_short_description(invalid_desc)
        self.assertEqual(
            context.exception.messages,
            ["Краткое описание должно содержать не менее 10 символов."]
        )

    def test_validate_short_description_with_empty_string(self):
        """Если описание пустое, валидатор ничего не должен делать."""
        try:
            validate_short_description("")
        except ValidationError:
            self.fail("validate_short_description() raised ValidationError for empty string.")
