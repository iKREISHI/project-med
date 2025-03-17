from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from unittest.mock import patch

from apps.users.services.update import UpdateUserService

User = get_user_model()


class UpdateUserServiceTests(TestCase):
    def setUp(self):
        # Создаем тестового пользователя для обновления
        self.user = User.objects.create_user(
            username='testuser', password='InitialPassword'
        )

    def test_update_fields_success(self):
        """
        Проверяет, что метод update_fields корректно обновляет существующие поля.
        В данном тесте обновляем поля is_staff и is_active, которые существуют в модели.
        """
        service = UpdateUserService(self.user)
        updated_user = service.update_fields(is_staff=True, is_active=False)
        self.assertTrue(updated_user.is_staff)
        self.assertFalse(updated_user.is_active)
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_staff)
        self.assertFalse(self.user.is_active)

    def test_update_fields_invalid_field(self):
        """
        Если передается несуществующее поле, должно быть выброшено исключение ValueError.
        """
        service = UpdateUserService(self.user)
        with self.assertRaises(ValueError) as context:
            service.update_fields(non_existent_field='value')
        self.assertIn("Пользователь не имеет поля: non_existent_field", str(context.exception))

    @patch('apps.users.services.update.GetUserService.get_user_by_username', return_value=None)
    def test_update_username_success(self, mock_get_user):
        """
        Проверяет, что username обновляется корректно, если новый username доступен.
        Патчим метод GetUserService.get_user_by_username, чтобы он вернул None.
        """
        service = UpdateUserService(self.user)
        new_username = 'new_username'
        updated_user = service.update_username(new_username)
        self.assertEqual(updated_user.username, new_username)
        mock_get_user.assert_called_once_with(new_username)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, new_username)

    def test_update_username_empty(self):
        """
        Если передается пустое значение для нового username, должен выброситься ValueError.
        """
        service = UpdateUserService(self.user)
        with self.assertRaises(ValueError) as context:
            service.update_username('')
        self.assertIn("Имя пользователя не может быть пустым", str(context.exception))

    @patch('apps.users.services.update.GetUserService.get_user_by_username', return_value=User(username='existing'))
    def test_update_username_already_exists(self, mock_get_user):
        """
        Если пользователь с новым именем уже существует, update_username должен выбросить ValueError.
        """
        service = UpdateUserService(self.user)
        with self.assertRaises(ValueError) as context:
            service.update_username('existing')
        self.assertIn("Пользователь с таким именем уже существует", str(context.exception))
        mock_get_user.assert_called_once_with('existing')

    def test_update_password_success(self):
        """
        Проверяет, что пароль корректно обновляется и захеширован.
        """
        service = UpdateUserService(self.user)
        new_password = 'NewSecurePassword'
        updated_user = service.update_password(new_password)
        # Проверяем, что в базе хранится не оригинальный текст пароля
        self.assertNotEqual(updated_user.password, new_password)
        # Метод check_password должен вернуть True
        self.assertTrue(updated_user.check_password(new_password))

    def test_update_password_empty(self):
        """
        Если передается пустой пароль, update_password должен выбросить ValueError.
        """
        service = UpdateUserService(self.user)
        with self.assertRaises(ValueError) as context:
            service.update_password('')
        self.assertIn("Новый пароль не может быть пустым", str(context.exception))

    def test_update_active_status(self):
        """
        Проверяет, что метод update_active_status корректно обновляет статус активности пользователя.
        """
        service = UpdateUserService(self.user)
        # Сначала переключаем статус на False
        updated_user = service.update_active_status(False)
        self.assertFalse(updated_user.is_active)
        self.user.refresh_from_db()
        self.assertFalse(self.user.is_active)

        # Затем переключаем обратно на True
        updated_user = service.update_active_status(True)
        self.assertTrue(updated_user.is_active)
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_active)
