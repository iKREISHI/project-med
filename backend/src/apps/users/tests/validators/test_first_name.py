from django.test import TestCase
from rest_framework.exceptions import ValidationError
from apps.users.validators.first_name import (
    validate_first_name_required,
    validate_first_name_length,
    validate_first_name_symbols,
)


class FirstNameValidatorsTests(TestCase):

    def test_validate_first_name_required_with_empty_string(self):
        """Проверяет, что если имя пустое, выбрасывается ошибка с сообщением о необходимости заполнить поле."""
        with self.assertRaises(ValidationError) as context:
            validate_first_name_required('')
        error = context.exception
        self.assertIn('first_name', error.detail)
        self.assertIn('Пожалуйста, заполните поле имени.', error.detail['first_name'])

    def test_validate_first_name_required_with_none(self):
        """Проверяет, что если имя равно None, выбрасывается ошибка о необходимости заполнить поле."""
        with self.assertRaises(ValidationError) as context:
            validate_first_name_required(None)
        error = context.exception
        self.assertIn('first_name', error.detail)
        self.assertIn('Пожалуйста, заполните поле имени.', error.detail['first_name'])

    def test_validate_first_name_required_valid(self):
        """Проверяет, что валидатор для обязательного поля не выбрасывает ошибку для заполненного имени."""
        try:
            validate_first_name_required('John')
        except ValidationError:
            self.fail("validate_first_name_required raised ValidationError unexpectedly for a valid first name.")

    def test_validate_first_name_length_too_short(self):
        """Проверяет, что имя, состоящее из одного символа, вызывает ошибку длины."""
        with self.assertRaises(ValidationError) as context:
            validate_first_name_length('A')
        error = context.exception
        self.assertIn('first_name', error.detail)
        self.assertIn('Имя должно содержать не менее 2 символов.', error.detail['first_name'])

    def test_validate_first_name_length_valid(self):
        """Проверяет, что имя, состоящее из 2 и более символов, проходит проверку длины."""
        try:
            validate_first_name_length('Ab')
        except ValidationError:
            self.fail("validate_first_name_length raised ValidationError unexpectedly for a valid first name.")

    def test_validate_first_name_symbols_invalid(self):
        """Проверяет, что имя с недопустимыми символами вызывает ошибку."""
        with self.assertRaises(ValidationError) as context:
            validate_first_name_symbols('John123')
        error = context.exception
        self.assertIn('first_name', error.detail)
        self.assertIn('Имя должно содержать только буквы.', error.detail['first_name'])

    def test_validate_first_name_symbols_valid(self):
        """Проверяет, что имя, состоящее только из букв (латиница или кириллица), проходит проверку."""
        try:
            validate_first_name_symbols('Алексей')
            validate_first_name_symbols('John')
        except ValidationError:
            self.fail("validate_first_name_symbols raised ValidationError unexpectedly for a valid first name.")
