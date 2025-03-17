from django.test import TestCase
from rest_framework.exceptions import ValidationError  # Используем DRF ValidationError
from apps.users.validators.password import (
    validate_password_exist,
    validate_password_length,
    validate_password_digits,
    validate_password_uppercase,
    validate_password_lowercase,
    validate_password_symbols,
    validate_password
)


class PasswordValidationTests(TestCase):

    def test_validate_password_exist(self):
        # Должно пройти без ошибок
        validate_password_exist('validPass123')

        # Должно вызывать ValidationError при пустом пароле
        with self.assertRaises(ValidationError) as exc:
            validate_password_exist('')
        self.assertIn('Пароль не должен быть пустым', str(exc.exception))

    def test_validate_password_length(self):
        # Должно пройти без ошибок
        validate_password_length('validPass123')

        # Должно вызвать ValidationError, если пароль короче 8 символов
        with self.assertRaises(ValidationError) as exc:
            validate_password_length('short')
        self.assertIn('Пароль должен быть не менее 8 символов.', str(exc.exception))

    def test_validate_password_digits(self):
        # Должно пройти без ошибок
        validate_password_digits('Password1')

        # Должно вызвать ValidationError, если нет цифр
        with self.assertRaises(ValidationError) as exc:
            validate_password_digits('NoNumbers')
        self.assertIn('Пароль должен содержать хотя бы одну цифру.', str(exc.exception))

    def test_validate_password_uppercase(self):
        # Должно пройти без ошибок
        validate_password_uppercase('Password1')

        # Должно вызвать ValidationError, если нет заглавных букв
        with self.assertRaises(ValidationError) as exc:
            validate_password_uppercase('password1')
        self.assertIn('Пароль должен содержать хотя бы одну заглавную букву.', str(exc.exception))

    def test_validate_password_lowercase(self):
        # Должно пройти без ошибок
        validate_password_lowercase('Password1')

        # Должно вызвать ValidationError, если нет строчных букв
        with self.assertRaises(ValidationError) as exc:
            validate_password_lowercase('PASSWORD1')
        self.assertIn('Пароль должен содержать хотя бы одну строчную букву.', str(exc.exception))

    def test_validate_password_symbols(self):
        # Должно пройти без ошибок
        validate_password_symbols('Valid123')

        # Проверка пароля без цифр
        with self.assertRaises(ValidationError) as exc:
            validate_password_symbols('NoNumbers')
        self.assertIn('Пароль должен содержать хотя бы одну цифру.', str(exc.exception))

        # Проверка пароля без заглавных букв
        with self.assertRaises(ValidationError) as exc:
            validate_password_symbols('nouppercase1')
        self.assertIn('Пароль должен содержать хотя бы одну заглавную букву.', str(exc.exception))

        # Проверка пароля без строчных букв
        with self.assertRaises(ValidationError) as exc:
            validate_password_symbols('NOLOWERCASE1')
        self.assertIn('Пароль должен содержать хотя бы одну строчную букву.', str(exc.exception))

    def test_validate_password(self):
        # Корректный пароль должен пройти без ошибок
        validate_password('ValidPass1')

        # Проверка короткого пароля
        with self.assertRaises(ValidationError) as exc:
            validate_password('Short1')
        self.assertIn('Пароль должен быть не менее 8 символов.', str(exc.exception))

        # Проверка пароля без цифры
        with self.assertRaises(ValidationError) as exc:
            validate_password('NoNumberPass')
        self.assertIn('Пароль должен содержать хотя бы одну цифру.', str(exc.exception))

        # Проверка пароля без заглавной буквы
        with self.assertRaises(ValidationError) as exc:
            validate_password('nouppercase1')
        self.assertIn('Пароль должен содержать хотя бы одну заглавную букву.', str(exc.exception))

        # Проверка пароля без строчной буквы
        with self.assertRaises(ValidationError) as exc:
            validate_password('NOLOWERCASE1')
        self.assertIn('Пароль должен содержать хотя бы одну строчную букву.', str(exc.exception))
