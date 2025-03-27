from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class LogoutViewSetTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='Testpass123')
        self.logout_url = reverse('logout-list')

    def test_logout_authenticated_user(self):
        # Аутентифицируем пользователя
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.logout_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # После logout можно проверить, что пользователь не аутентифицирован.
        # Для этого отправляем новый запрос без принудительной аутентификации.
        self.client.logout()
        response2 = self.client.post(self.logout_url, format='json')
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response2.data['non_field_errors'], 'Вы уже вышли из системы')

    def test_logout_not_authenticated_user(self):
        # Пользователь не аутентифицирован
        response = self.client.post(self.logout_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)
        self.assertEqual(response.data['non_field_errors'], 'Вы уже вышли из системы')
