from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class UsersViewSetTestCase(APITestCase):
    def setUp(self):
        # Создаем суперпользователя для прохождения проверки разрешений.
        # DjangoModelPermissions требует аутентификацию и соответствующие права.
        self.admin_user = User.objects.create_superuser(
            username="admin", password="adminpass",
        )
        self.client.force_authenticate(user=self.admin_user)
        # Предполагаем, что роутер зарегистровал этот ViewSet с basename 'users'
        self.list_url = reverse("users-list")

    def test_list_users(self):
        """Проверяем, что GET-запрос к list endpoint возвращает список пользователей."""
        # Создаем несколько тестовых пользователей.
        User.objects.create_user(username="user1", password="test123")
        User.objects.create_user(username="user2", password="test123")
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        # Если включена пагинация, ожидаем словарь с ключами "count" и "results"
        if isinstance(data, dict):
            self.assertIn("count", data)
            self.assertIn("results", data)
            # В базе должно быть как минимум 3 пользователя: admin, user1, user2
            self.assertGreaterEqual(data["count"], 3)
        else:
            self.assertGreaterEqual(len(data), 3)

    def test_retrieve_user(self):
        """Проверяем получение пользователя по ID."""
        user = User.objects.create_user(username="user3", password="test123")
        detail_url = reverse("users-detail", kwargs={"pk": user.id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "user3")

    def test_create_user(self):
        """Проверяем создание нового пользователя через POST."""
        # Предполагаем, что сериализатор требует поля username, email и password.
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "newpassword123"
        }
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["username"], "newuser")

    def test_update_user(self):
        """Проверяем обновление пользователя через PUT запрос."""
        user = User.objects.create_user(username="updateuser", password="test123")
        detail_url = reverse("users-detail", kwargs={"pk": user.id})
        update_data = {
            "username": "updateduser",
            "email": "updated@example.com"
        }
        response = self.client.put(detail_url, update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertEqual(user.username, "updateduser")

    def test_destroy_user(self):
        """Проверяем удаление пользователя через DELETE запрос."""
        user = User.objects.create_user(username="deleteuser", password="test123")
        detail_url = reverse("users-detail", kwargs={"pk": user.id})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(id=user.id).exists())
