from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class RegistrationViewSetTest(APITestCase):
    def setUp(self):
        self.registration_url = reverse('registration-list')

        self.valid_data = {
            'username': 'newuser',
            'password': 'Validpass123',
            'password2': 'Validpass123',
            'email': 'newuser@example.com',
            'avatar': None,
        }
        # Данные с несовпадающими паролями
        self.password_mismatch_data = {
            'username': 'newuser2',
            'password': 'Validpass123',
            'password2': 'DifferentPass123',
            'email': 'newuser2@example.com',
            'avatar': None,
        }
        # Данные с отсутствием обязательных полей (например, username и password)
        self.missing_fields_data = {
            'first_name': 'Ivan',
            'last_name': 'Ivanov',
        }
        # Пользователь для проверки сценария "уже аутентифицирован"
        self.existing_user = User.objects.create_user(username='existinguser', password='Validpass123')

    def test_already_authenticated(self):
        # Если пользователь уже залогинен, регистрация не разрешена
        self.client.force_authenticate(user=self.existing_user)
        response = self.client.post(self.registration_url, self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Вы уже авторизованы')

    def test_valid_registration(self):
        # Проверяем регистрацию с полным набором данных
        response = self.client.post(self.registration_url, self.valid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], 'Вы успешно зарегистрировались.')
        # Убеждаемся, что пользователь создан в базе
        self.assertTrue(User.objects.filter(username=self.valid_data['username']).exists())

    def test_password_mismatch(self):
        # Если пароли не совпадают, должна возвращаться ошибка
        response = self.client.post(self.registration_url, self.password_mismatch_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
        self.assertEqual(response.data['password'][0], 'Пароли не совпадают.')

    def test_missing_required_fields(self):
        # Если не переданы обязательные поля, регистрация не проходит
        response = self.client.post(self.registration_url, self.missing_fields_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        self.assertIn('password', response.data)

    def test_minimal_valid_registration(self):
        # Регистрация с минимальным набором полей (без email, patronymic, avatar)
        minimal_data = {
            'username': 'minimaluser',
            'password': 'Validpass123',
            'password2': 'Validpass123',
            'first_name': 'Ivan',
            'last_name': 'Ivanov',
        }
        response = self.client.post(self.registration_url, minimal_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], 'Вы успешно зарегистрировались.')
        self.assertTrue(User.objects.filter(username=minimal_data['username']).exists())
