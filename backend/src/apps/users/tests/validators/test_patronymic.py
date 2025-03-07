from django.test import TestCase
from rest_framework.exceptions import ValidationError
from apps.users.validators.patronymic import (
    validate_patronymic_length,
    validate_patronymic_symbols,
)


class PatronymicValidatorsTests(TestCase):

    def test_validate_patronymic_length_empty(self):
        """Если отчество пустое, валидатор не должен выбрасывать ошибку."""
        try:
            validate_patronymic_length("")
        except ValidationError:
            self.fail("validate_patronymic_length raised ValidationError unexpectedly for empty patronymic.")

    def test_validate_patronymic_length_none(self):
        """Если отчество равно None, валидатор не должен выбрасывать ошибку."""
        try:
            validate_patronymic_length(None)
        except ValidationError:
            self.fail("validate_patronymic_length raised ValidationError unexpectedly for None patronymic.")

    def test_validate_patronymic_length_too_short(self):
        """Если отчество содержит менее 2 символов, валидатор должен выбросить ошибку."""
        with self.assertRaises(ValidationError) as context:
            validate_patronymic_length("A")
        error = context.exception
        self.assertIn("patronymic", error.detail)
        self.assertIn("Отчество должно содержать не менее 2 символов.", error.detail["patronymic"])

    def test_validate_patronymic_length_valid(self):
        """Отчество, содержащее 2 и более символов, должно проходить проверку."""
        try:
            validate_patronymic_length("Alex")
        except ValidationError:
            self.fail("validate_patronymic_length raised ValidationError unexpectedly for valid patronymic.")

    def test_validate_patronymic_symbols_empty(self):
        """Если отчество пустое, валидатор символов не должен выбрасывать ошибку."""
        try:
            validate_patronymic_symbols("")
        except ValidationError:
            self.fail("validate_patronymic_symbols raised ValidationError unexpectedly for empty patronymic.")

    def test_validate_patronymic_symbols_none(self):
        """Если отчество равно None, валидатор символов не должен выбрасывать ошибку."""
        try:
            validate_patronymic_symbols(None)
        except ValidationError:
            self.fail("validate_patronymic_symbols raised ValidationError unexpectedly for None patronymic.")

    def test_validate_patronymic_symbols_invalid(self):
        """Если отчество содержит недопустимые символы (например, цифры), валидатор должен выбросить ошибку."""
        with self.assertRaises(ValidationError) as context:
            validate_patronymic_symbols("Alex123")
        error = context.exception
        self.assertIn("patronymic", error.detail)
        self.assertIn("Отчество должно содержать только буквы.", error.detail["patronymic"])

    def test_validate_patronymic_symbols_valid(self):
        """Отчество, состоящее только из букв (кириллица или латиница), должно проходить проверку."""
        try:
            validate_patronymic_symbols("Александрович")
            validate_patronymic_symbols("Alexandrovich")
        except ValidationError:
            self.fail("validate_patronymic_symbols raised ValidationError unexpectedly for a valid patronymic.")
