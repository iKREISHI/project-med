from django.test import TestCase
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from apps.users.validators.email import validate_email_format, validate_email_unique

User = get_user_model()


class EmailValidatorsTests(TestCase):
    def test_validate_email_format_valid(self):
        """
        Проверяет, что валидатор формата email не выбрасывает исключение для корректного email.
        """
        try:
            validate_email_format("test@example.com")
        except ValidationError:
            self.fail("validate_email_format raised ValidationError unexpectedly for a valid email.")

    def test_validate_email_format_invalid(self):
        """
        Проверяет, что валидатор формата email выбрасывает ValidationError для некорректного email,
        и сообщение ошибки содержит 'Неверный формат почты'.
        """
        with self.assertRaises(ValidationError) as context:
            validate_email_format("invalid-email")
        error = context.exception
        # Проверяем, что в error.detail есть ключ 'email'
        self.assertIn("email", error.detail)
        self.assertIn("Неверный формат почты", error.detail["email"])

    def test_validate_email_unique_with_existing_email(self):
        """
        Проверяет, что валидатор уникальности email выбрасывает ValidationError,
        если пользователь с данным email уже существует.
        """
        # Создаем пользователя с заданным email
        User.objects.create_user(
            username="user1",
            password="Securepassword123",
            email="exists@example.com",
            first_name="Test",
            last_name="User"
        )
        with self.assertRaises(ValidationError) as context:
            validate_email_unique("exists@example.com")
        error = context.exception
        self.assertIn("email", error.detail)
        self.assertIn("Пользователь с данной почтой уже существует", error.detail["email"])

    def test_validate_email_unique_with_new_email(self):
        """
        Проверяет, что валидатор уникальности email не выбрасывает исключение для нового email.
        """
        try:
            validate_email_unique("new@example.com")
        except ValidationError:
            self.fail("validate_email_unique raised ValidationError unexpectedly for a unique email.")
