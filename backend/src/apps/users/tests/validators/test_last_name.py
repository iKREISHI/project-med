from django.test import TestCase
from rest_framework.exceptions import ValidationError
from apps.users.validators.last_name import (
    validate_last_name_required,
    validate_last_name_length,
    validate_last_name_symbols,
)


class LastNameValidatorsTests(TestCase):

    def test_validate_last_name_required_empty(self):
        """
        Проверяет, что если фамилия пустая, валидатор выбрасывает ошибку с сообщением о необходимости заполнить поле.
        """
        with self.assertRaises(ValidationError) as context:
            validate_last_name_required('')
        error = context.exception
        self.assertIn('last_name', error.detail)
        self.assertIn('Пожалуйста, заполните поле фамилии.', error.detail['last_name'])

    def test_validate_last_name_required_none(self):
        """
        Проверяет, что если фамилия равна None, валидатор выбрасывает ошибку с сообщением о необходимости заполнить поле.
        """
        with self.assertRaises(ValidationError) as context:
            validate_last_name_required(None)
        error = context.exception
        self.assertIn('last_name', error.detail)
        self.assertIn('Пожалуйста, заполните поле фамилии.', error.detail['last_name'])

    def test_validate_last_name_required_valid(self):
        """
        Проверяет, что валидатор для обязательного поля не выбрасывает ошибку для непустой фамилии.
        """
        try:
            validate_last_name_required('Иванов')
        except ValidationError:
            self.fail("validate_last_name_required raised ValidationError unexpectedly for a valid last name.")

    def test_validate_last_name_length_too_short(self):
        """Проверяет, что фамилия, содержащая менее 2 символов, вызывает ошибку с соответствующим сообщением."""
        with self.assertRaises(ValidationError) as context:
            validate_last_name_length('A')
        error = context.exception
        self.assertIn('last_name', error.detail)
        self.assertIn('Фамилия должна содержать не менее 2 символов.', error.detail['last_name'])

    def test_validate_last_name_length_valid(self):
        """Проверяет, что фамилия, содержащая 2 и более символов, проходит проверку длины."""
        try:
            validate_last_name_length('Li')
        except ValidationError:
            self.fail("validate_last_name_length raised ValidationError unexpectedly for a valid last name.")

    def test_validate_last_name_symbols_invalid(self):
        """Проверяет, что фамилия с недопустимыми символами вызывает ошибку с соответствующим сообщением."""
        with self.assertRaises(ValidationError) as context:
            validate_last_name_symbols('Smith123')
        error = context.exception
        self.assertIn('last_name', error.detail)
        self.assertIn('Фамилия должна содержать только буквы.', error.detail['last_name'])

    def test_validate_last_name_symbols_valid(self):
        """Проверяет, что фамилия, состоящая только из букв (латиница или кириллица), проходит проверку."""
        try:
            validate_last_name_symbols('Smith')
            validate_last_name_symbols('Иванов')
        except ValidationError:
            self.fail("validate_last_name_symbols raised ValidationError unexpectedly for a valid last name.")
