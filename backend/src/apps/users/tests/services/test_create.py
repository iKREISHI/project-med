from django.contrib.auth import get_user_model
from django.test import TestCase
from django.core.exceptions import ValidationError
from unittest.mock import patch

User = get_user_model()
from apps.users.services import CreateUserService

class CreateUserServiceTests(TestCase):
    @patch('apps.users.services.create.validate_username')
    def test_create_user_success(self, mock_validate_username):
        """
        Тест успешного создания обычного пользователя.
        Проверяется, что функция валидации вызывается и пользователь
        создается с корректными данными.
        """
        username = 'validuser'
        password = 'StrongPassword123'

        service = CreateUserService(username=username, password=password)
        user = service.create_user()

        # Проверяем, что созданный объект является экземпляром модели User
        self.assertIsInstance(user, User)
        self.assertEqual(user.username, username)
        # Проверяем, что у пользователя не установлен флаг суперпользователя
        self.assertFalse(user.is_superuser)
        # Функция валидации должна была быть вызвана с заданным username
        mock_validate_username.assert_called_once_with(username)

    @patch('apps.users.services.create.validate_username')
    def test_create_superuser_success(self, mock_validate_username):
        """
        Тест успешного создания суперпользователя.
        Проверяется, что созданный пользователь имеет флаги is_superuser и is_staff.
        """
        username = 'adminuser'
        password = 'AdminPassword123'

        service = CreateUserService(username=username, password=password)
        user = service.create_superuser()

        self.assertIsInstance(user, User)
        self.assertEqual(user.username, username)
        # Для суперпользователя должны быть установлены флаги is_superuser и is_staff
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)
        mock_validate_username.assert_called_once_with(username)

    @patch('apps.users.services.create.validate_username')
    def test_create_user_invalid_username(self, mock_validate_username):
        """
        Тест создания пользователя с некорректным именем.
        При ошибке валидации должно быть выброшено исключение ValidationError.
        """
        # Имитируем некорректное имя пользователя
        mock_validate_username.side_effect = ValidationError("Invalid username")
        username = 'invalid username'
        password = 'SomePassword'

        service = CreateUserService(username=username, password=password)
        with self.assertRaises(ValidationError):
            service.create_user()

    @patch('apps.users.services.create.validate_username')
    def test_create_superuser_invalid_username(self, mock_validate_username):
        """
        Тест создания суперпользователя с некорректным именем.
        При ошибке валидации должно быть выброшено исключение ValidationError.
        """
        mock_validate_username.side_effect = ValidationError("Invalid username")
        username = 'invalid username'
        password = 'SomePassword'

        service = CreateUserService(username=username, password=password)
        with self.assertRaises(ValidationError):
            service.create_superuser()
