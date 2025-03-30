import datetime
from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from apps.medical_activity.models import ReceptionTemplate
from apps.staffing.models import Specialization

User = get_user_model()


class ReceptionTemplateViewSetTests(APITestCase):
    def setUp(self):
        # Создаем суперпользователя для прохождения permissions
        self.user = User.objects.create_superuser(
            username="testuser", password="pass"
        )
        self.client.force_authenticate(user=self.user)

        # Создаем тестовую специализацию для ReceptionTemplate
        self.specialization = Specialization.objects.create(title="Test Specialization")

        # Создаем 15 объектов ReceptionTemplate для тестирования пагинации
        self.templates = []
        for i in range(15):
            template = ReceptionTemplate.objects.create(
                name=f"Template {i}",
                specialization=self.specialization
            )
            self.templates.append(template)

        # Получаем URL для list эндпоинта. Предполагается, что basename в роутере "receptiontemplate"
        self.list_url = reverse("receptiontemplate-list")

    def test_list_pagination(self):
        # Проверяем пагинацию по умолчанию (page_size=10)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data.get("count"), 15)
        self.assertEqual(len(data.get("results")), 10)
        self.assertIsNotNone(data.get("next"))

        # Проверяем изменение размера страницы через параметр page_size
        response = self.client.get(self.list_url, {"page_size": 5})
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data.get("count"), 15)
        self.assertEqual(len(data.get("results")), 5)

    def test_retrieve(self):
        # Проверяем получение детали объекта по id
        template = self.templates[0]
        detail_url = reverse("receptiontemplate-detail", kwargs={"id": template.id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["id"], template.id)
        self.assertEqual(data["name"], template.name)
        self.assertEqual(data["specialization"], self.specialization.id)

    def test_create(self):
        # Используем format='json', чтобы вложенные словари корректно сериализовались
        payload = {
            "name": "New Template",
            "specialization": self.specialization.id,
            "description": "Test description",
            "html": "<p>Test</p>",
            "fields": {"key": "value"}
        }
        response = self.client.post(self.list_url, payload, format='json')
        self.assertEqual(response.status_code, 201)
        data = response.data
        self.assertEqual(data["name"], "New Template")
        self.assertEqual(data["specialization"], self.specialization.id)

    def test_update(self):
        # Используем format='json'
        template = self.templates[0]
        detail_url = reverse("receptiontemplate-detail", kwargs={"id": template.id})
        payload = {
            "name": "Updated Template",
            "specialization": self.specialization.id,
            "description": "Updated description",
            "html": "<p>Updated</p>",
            "fields": {"updated": True}
        }
        response = self.client.put(detail_url, payload, format='json')
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["name"], "Updated Template")
        self.assertEqual(data["description"], "Updated description")

    def test_partial_update(self):
        # Используем format='json'
        template = self.templates[0]
        detail_url = reverse("receptiontemplate-detail", kwargs={"id": template.id})
        payload = {
            "name": "Partially Updated Template",
        }
        response = self.client.patch(detail_url, payload, format='json')
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["name"], "Partially Updated Template")

    def test_destroy(self):
        # Проверяем удаление объекта
        template = self.templates[0]
        detail_url = reverse("receptiontemplate-detail", kwargs={"id": template.id})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, 204)
        # Проверяем, что объект удален из базы
        exists = ReceptionTemplate.objects.filter(id=template.id).exists()
        self.assertFalse(exists)
