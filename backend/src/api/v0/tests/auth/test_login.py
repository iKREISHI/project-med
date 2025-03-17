from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.staffing.models import Employee, Position

User = get_user_model()


class LoginViewSetTest(APITestCase):
    def setUp(self):
        # Создаем тестового пользователя.
        self.user = User.objects.create_user(username='testuser', password='Testpass123')

        # Создаем должность (Position). Если такая уже существует, получаем её.
        self.position, created = Position.objects.get_or_create(
            name="Администратор",
            defaults={
                "short_name": "Админ",
                "minzdrav_position": "Администратор"
            }
        )

        # Создаем объект Employee для тестового пользователя.
        # Предполагается, что AbstractPersonModel требует хотя бы first_name и last_name.
        self.employee = Employee.objects.create(
            user=self.user,
            first_name="Test",
            last_name="User",
            position=self.position,
        )

        # URL для логина (предполагается, что роутинг настроен на '/api/v0/login/')
        self.login_url = '/api/v0/login/'

    def test_already_authenticated(self):
        """
        Если пользователь уже авторизован, должен вернуться статус 400 с сообщением 'Вы уже авторизованы'.
        """
        self.client.force_authenticate(user=self.user)
        data = {'username': 'testuser', 'password': 'Testpass123'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Вы уже авторизованы')

    def test_missing_username(self):
        """
        Если не указан username, должен вернуться статус 400 с ошибкой о обязательном поле.
        """
        data = {'password': 'Testpass123'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        self.assertEqual(response.data['username'][0], 'Пожалуйста, укажите имя пользователя.')

    def test_missing_password(self):
        """
        Если не указан пароль, должен вернуться статус 400 с ошибкой о обязательном поле.
        """
        data = {'username': 'testuser'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
        self.assertEqual(response.data['password'][0], 'Пожалуйста, укажите пароль.')

    def test_invalid_credentials(self):
        """
        Если введены неверные креденшелы, должен вернуться статус 400 с сообщением 'Неверное имя пользователя или пароль.'.
        """
        data = {'username': 'testuser', 'password': 'WrongPassword'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        self.assertEqual(response.data['username'][0], 'Неверное имя пользователя или пароль.')

    def test_valid_login(self):
        """
        При корректных креденшелах должен вернуться статус 200 с данными пользователя, включая user_uuid, position_uuid и позицию.
        """
        data = {'username': 'testuser', 'password': 'Testpass123'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Успешный вход')
        self.assertIn('user_uuid', response.data)
        self.assertIn('position_uuid', response.data)
        self.assertIn('position', response.data)
