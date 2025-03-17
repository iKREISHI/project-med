from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class LoginViewSetTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='Testpass123')
        self.login_url = '/api/v0/login/'

    def test_already_authenticated(self):
        # Принудительно аутентифицируем пользователя.
        self.client.force_authenticate(user=self.user)
        data = {'username': 'testuser', 'password': 'Testpass123'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Вы уже авторизованы')

    def test_missing_username(self):
        data = {'password': 'Testpass123'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        self.assertEqual(response.data['username'][0], 'Пожалуйста, укажите имя пользователя.')

    def test_missing_password(self):
        data = {'username': 'testuser'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
        self.assertEqual(response.data['password'][0], 'Пожалуйста, укажите пароль.')

    def test_invalid_credentials(self):
        data = {'username': 'testuser', 'password': 'WrongPassword'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        self.assertEqual(response.data['username'][0], 'Неверное имя пользователя или пароль.')

    def test_valid_login(self):
        data = {'username': 'testuser', 'password': 'Testpass123'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Успешный вход')
