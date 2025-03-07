from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.serializers import ValidationError
from apps.users.validators.username import (
    validate_username_exists,
    validate_username_unique,
    validate_username_length,
    validate_username_symbols,
)

User = get_user_model()


class UsernameValidationTests(TestCase):

    def setUp(self):
        self.user = User.objects.create(username='existing_user')

    def test_validate_username_exists(self):
        # Должно пройти без ошибок
        validate_username_exists('existing_user')

        # Должно вызывать ValidationError
        with self.assertRaises(ValidationError) as exc:
            validate_username_exists('non_existent_user')
        self.assertIn('Данное имя пользователя не существует.', str(exc.exception))

    def test_validate_username_unique(self):
        # Должно вызвать ValidationError, так как имя уже существует
        with self.assertRaises(ValidationError) as exc:
            validate_username_unique('existing_user')
        self.assertIn('Данное имя пользователя уже существует.', str(exc.exception))

        # Должно пройти без ошибок, если имя уникально
        validate_username_unique('unique_user')

    def test_validate_username_length(self):
        # Должно пройти без ошибок
        validate_username_length('abcdef')

        # Должно вызвать ValidationError, если длина меньше 6
        with self.assertRaises(ValidationError) as exc:
            validate_username_length('abc')
        self.assertIn('Имя пользователя должно быть не менее 6 символов.', str(exc.exception))

    def test_validate_username_symbols(self):
        # Корректные имена пользователей
        validate_username_symbols('valid_user')
        validate_username_symbols('User_123')

        # Некорректные имена пользователей
        with self.assertRaises(ValidationError) as exc:
            validate_username_symbols('invalid user')
        self.assertIn('Имя пользователя должно содержать только латинские буквы, цифры и символ подчеркивания.',
                      str(exc.exception))

        with self.assertRaises(ValidationError) as exc:
            validate_username_symbols('user@name')
        self.assertIn('Имя пользователя должно содержать только латинские буквы, цифры и символ подчеркивания.',
                      str(exc.exception))
