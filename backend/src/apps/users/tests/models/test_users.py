import datetime
from django.test import TestCase
from django.utils import timezone
from django.db.utils import IntegrityError
from django.contrib.auth import get_user_model

User = get_user_model()


class UserModelTests(TestCase):

    def test_create_user_success(self):
        """Проверка успешного создания обычного пользователя с корректными данными."""
        user = User.objects.create_user(
            username='johndoe',
            password='securepassword123',
            email='user@example.com',
            first_name='John',
            last_name='Doe'
        )
        self.assertEqual(user.username, 'johndoe')
        self.assertEqual(user.email, 'user@example.com')
        self.assertTrue(user.check_password('securepassword123'))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)
        self.assertIsInstance(user.date_joined, datetime.datetime)

    def test_create_superuser_success(self):
        """Проверка успешного создания суперпользователя с корректными флагами."""
        superuser = User.objects.create_superuser(
            username='admin',
            password='adminpassword123',
            email='admin@example.com',
            first_name='Admin',
            last_name='User'
        )
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)
        self.assertTrue(superuser.is_active)

    def test_username_uniqueness(self):
        """Проверка уникальности поля username."""
        User.objects.create_user(
            username='uniqueuser',
            password='securepassword123',
            email='unique1@example.com',
            first_name='Test',
            last_name='User'
        )
        with self.assertRaises(IntegrityError):
            User.objects.create_user(
                username='uniqueuser',
                password='securepassword123',
                email='unique2@example.com',
                first_name='Another',
                last_name='User'
            )

    def test_email_uniqueness(self):
        """Проверка уникальности поля email."""
        User.objects.create_user(
            username='user1',
            password='securepassword123',
            email='unique@example.com',
            first_name='Test',
            last_name='User'
        )
        with self.assertRaises(IntegrityError):
            User.objects.create_user(
                username='user2',
                password='securepassword123',
                email='unique@example.com',
                first_name='Another',
                last_name='User'
            )

    def test_missing_username_raises_error(self):
        """При отсутствии username должно выбрасываться исключение ValueError."""
        with self.assertRaises(ValueError) as context:
            User.objects.create_user(
                username='',
                password='securepassword123',
                email='test@example.com',
                first_name='Test',
                last_name='User'
            )
        self.assertEqual(str(context.exception), 'The username must be set')

    def test_missing_password_raises_error(self):
        """При отсутствии пароля должно выбрасываться исключение ValueError."""
        with self.assertRaises(ValueError) as context:
            User.objects.create_user(
                username='testuser',
                password='',
                email='test@example.com',
                first_name='Test',
                last_name='User'
            )
        self.assertEqual(str(context.exception), 'The password must be set')

    def test_get_full_name(self):
        """Проверка работы метода get_full_name()."""
        user = User.objects.create_user(
            username='johndoe',
            password='securepassword123',
            email='user@example.com',
            first_name='John',
            last_name='Doe'
        )
        self.assertEqual(user.get_full_name(), 'John Doe')

    def test_get_short_name(self):
        """Проверка работы метода get_short_name()."""
        user = User.objects.create_user(
            username='janedoe',
            password='securepassword123',
            email='jane@example.com',
            first_name='Jane',
            last_name='Doe'
        )
        self.assertEqual(user.get_short_name(), 'Jane')

    def test_avatar_field(self):
        """Проверка сохранения значения поля avatar."""
        user = User.objects.create_user(
            username='avataruser',
            password='securepassword123',
            email='avatar@example.com',
            first_name='Avatar',
            last_name='User',
            avatar='avatars/test.jpg'
        )
        self.assertEqual(user.avatar.name, 'avatars/test.jpg')

    def test_date_joined_default(self):
        """Проверка, что поле date_joined устанавливается автоматически."""
        user = User.objects.create_user(
            username='dateuser',
            password='securepassword123',
            email='date@example.com',
            first_name='Date',
            last_name='User'
        )
        self.assertIsNotNone(user.date_joined)
        # Проверяем, что разница между текущим временем и date_joined не превышает 5 секунд
        self.assertLessEqual((timezone.now() - user.date_joined).total_seconds(), 5)

    def test_password_validation_in__create_user(self):
        """
        Тест валидации пароля при создании через внутренний метод _create_user.
        Ожидается, что при использовании слишком короткого пароля будет выброшено исключение.
        """
        with self.assertRaises(ValueError) as context:
            User.objects._create_user(
                username='invalidpassworduser',
                password='short',
                email='invalid@example.com',
                first_name='Invalid',
                last_name='User'
            )
        self.assertEqual(
            str(context.exception),
            'The given password must be at least 8 characters long'
        )
