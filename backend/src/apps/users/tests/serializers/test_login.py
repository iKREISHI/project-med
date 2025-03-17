from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from apps.users.serializers.login import LoginSerializer

User = get_user_model()


class LoginSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='Testpass123')

    def test_missing_username(self):
        data = {'password': 'Testpass123'}
        serializer = LoginSerializer(data=data)
        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
        self.assertIn('username', context.exception.detail)
        # Проверяем первый элемент списка ошибок
        self.assertEqual(
            context.exception.detail['username'][0],
            'Пожалуйста, укажите имя пользователя.'
        )

    def test_missing_password(self):
        data = {'username': 'testuser'}
        serializer = LoginSerializer(data=data)
        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
        self.assertIn('password', context.exception.detail)
        self.assertEqual(
            context.exception.detail['password'][0],
            'Пожалуйста, укажите пароль.'
        )

    def test_invalid_credentials(self):
        data = {'username': 'testuser', 'password': 'WrongPassword'}
        serializer = LoginSerializer(data=data)
        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
        self.assertIn('username', context.exception.detail)
        self.assertEqual(
            context.exception.detail['username'][0],
            'Неверное имя пользователя или пароль.'
        )

    def test_valid_credentials(self):
        data = {'username': 'testuser', 'password': 'Testpass123'}
        serializer = LoginSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data['user'], self.user)
