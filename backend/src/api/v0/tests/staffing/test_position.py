from django.urls import reverse
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from rest_framework import status
from rest_framework.test import APITestCase
from apps.staffing.models.position import Position

User = get_user_model()


class PositionViewSetTestCase(APITestCase):
    def setUp(self):
        # Создаем суперпользователя для проверки разрешений
        self.admin_user = User.objects.create_superuser(username='admin', password='adminpass')
        self.client.force_authenticate(user=self.admin_user)

        # Создаем тестовую группу для связки с должностью
        self.group = Group.objects.create(name="Test Group")

        # valid_data для прямого создания модели (ORM) – поле group принимает экземпляр Group
        self.valid_data_model = {
            "group": self.group,
            "name": "Manager",
            "short_name": "Mgr",
            "minzdrav_position": "Manager Min"
        }
        # valid_data для API запросов – поле group передается как pk
        self.valid_data_api = {
            "group": self.group.pk,
            "name": "Manager",
            "short_name": "Mgr",
            "minzdrav_position": "Manager Min"
        }
        self.list_url = reverse('position-list')

    def test_list_positions(self):
        """Проверяет, что list endpoint возвращает должности с пагинацией."""
        # Создаем две должности через ORM (используем valid_data_model)
        Position.objects.create(**self.valid_data_model)
        Position.objects.create(
            group=self.group,
            name="Developer",
            short_name="Dev",
            minzdrav_position="Developer Min"
        )
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data_response = response.data
        # Проверяем наличие ключей пагинации
        self.assertIn("count", data_response)
        self.assertIn("results", data_response)
        self.assertEqual(data_response["count"], 2)
        names = [item["name"] for item in data_response["results"]]
        self.assertIn("Manager", names)
        self.assertIn("Developer", names)

    def test_retrieve_position(self):
        """Проверяет получение должности по pk."""
        position = Position.objects.create(**self.valid_data_model)
        detail_url = reverse('position-detail', kwargs={'id': position.id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], self.valid_data_model["name"])

    def test_create_position(self):
        """Проверяет создание должности через POST с корректными данными."""
        response = self.client.post(self.list_url, self.valid_data_api, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], self.valid_data_api["name"])
        self.assertEqual(response.data["short_name"], self.valid_data_api["short_name"])
        self.assertEqual(response.data["minzdrav_position"], self.valid_data_api["minzdrav_position"])

    def test_create_position_with_unknown_field(self):
        """Проверяет, что при передаче неизвестного поля возникает ошибка валидации."""
        data = self.valid_data_api.copy()
        data["unknown_field"] = "unexpected"
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("unknown_field", response.data)
        self.assertEqual(response.data["unknown_field"][0], "This field is not allowed.")

    def test_create_position_invalid_field_type(self):
        """Проверяет, что если для поля name передано не строковое значение, возвращается ошибка."""
        data = self.valid_data_api.copy()
        data["name"] = 12345  # число вместо строки
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)
        self.assertEqual(response.data["name"][0], "This field must be a string.")

    def test_update_position(self):
        """Проверяет обновление должности через PUT запрос."""
        position = Position.objects.create(**self.valid_data_model)
        detail_url = reverse('position-detail', kwargs={'id': position.id})
        update_data = {
            "name": "Updated Manager",
            "short_name": "UpdMgr",
            "minzdrav_position": "Updated Manager Min"
        }
        response = self.client.put(detail_url, update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        position.refresh_from_db()
        self.assertEqual(position.name, "Updated Manager")
        self.assertEqual(position.short_name, "UpdMgr")
        self.assertEqual(position.minzdrav_position, "Updated Manager Min")

    def test_update_position_with_unknown_field(self):
        """Проверяет, что попытка обновить должность с неизвестным полем приводит к ошибке."""
        position = Position.objects.create(**self.valid_data_model)
        detail_url = reverse('position-detail', kwargs={'id': position.id})
        update_data = {"nonexistent": "value"}
        response = self.client.put(detail_url, update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("nonexistent", response.data)
        self.assertEqual(response.data["nonexistent"][0], "This field is not allowed.")

    def test_destroy_position(self):
        """Проверяет удаление должности через DELETE запрос."""
        position = Position.objects.create(**self.valid_data_model)
        detail_url = reverse('position-detail', kwargs={'id': position.id})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Position.objects.filter(id=position.id).exists())
