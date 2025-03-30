from django.urls import reverse, path, include
from django.test import override_settings, TestCase
from rest_framework.routers import DefaultRouter
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from apps.medical_activity.models.diagnosis_category import DiagnosisCategory
from apps.medical_activity.serializers.diagnosis_category import DiagnosisCategorySerializer
from api.v0.views.medical_activity.diagnosis_category import DiagnosisCategoryViewSet

User = get_user_model()


class DiagnosisCategoryViewSetTests(APITestCase):
    def setUp(self):
        # Создаем суперпользователя для прохождения permissions
        self.user = User.objects.create_superuser(username="admin", password="pass")
        self.client.force_authenticate(user=self.user)

        # Создаем несколько объектов DiagnosisCategory
        self.categories = []
        for i in range(5):
            category = DiagnosisCategory.objects.create(
                name=f"Category {i}",
                description=f"Description {i}"
            )
            self.categories.append(category)

        self.list_url = reverse("diagnosiscategory-list")

    def test_list_pagination(self):
        """Проверяем, что list-эндпоинт возвращает пагинированный список категорий диагноза."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 200)
        data = response.data

        # Проверяем наличие ключей пагинации: count, next, results
        self.assertIn("count", data)
        self.assertIn("next", data)
        self.assertIn("results", data)
        self.assertEqual(data["count"], 5)
        # Если CustomPagination настроена на вывод всех объектов, длина results может быть 5,
        # иначе проверяем стандартное значение
        self.assertEqual(len(data["results"]), 5)

    def test_retrieve(self):
        """Проверяем получение категории диагноза по id."""
        category = self.categories[0]
        detail_url = reverse("diagnosiscategory-detail", kwargs={"id": category.id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, 200)
        data = response.data

        self.assertEqual(data["id"], category.id)
        self.assertEqual(data["name"], category.name)
        self.assertEqual(data["description"], category.description)

    def test_create(self):
        """Проверяем создание новой категории диагноза через POST."""
        payload = {
            "name": "New Category",
            "description": "New description"
        }
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, 201)
        data = response.data

        self.assertEqual(data["name"], "New Category")
        self.assertEqual(data["description"], "New description")
        # Проверяем, что поле id заполнено, а также, что объект создан
        self.assertTrue(data.get("id"))
        exists = DiagnosisCategory.objects.filter(id=data["id"]).exists()
        self.assertTrue(exists)

    def test_create_unknown_field(self):
        """Проверяем, что при передаче неизвестного поля возникает ошибка валидации."""
        payload = {
            "name": "Another Category",
            "description": "Another description",
            "unknown_field": "unexpected"
        }
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("unknown_field", response.data)
        self.assertEqual(response.data["unknown_field"], ["This field is not allowed."])

    def test_update(self):
        """Проверяем полное обновление категории диагноза через PUT."""
        category = self.categories[0]
        detail_url = reverse("diagnosiscategory-detail", kwargs={"id": category.id})
        payload = {
            "name": "Updated Category",
            "description": "Updated description"
        }
        response = self.client.put(detail_url, payload, format="json")
        self.assertEqual(response.status_code, 200)
        data = response.data

        self.assertEqual(data["name"], "Updated Category")
        self.assertEqual(data["description"], "Updated description")

    def test_partial_update(self):
        """Проверяем частичное обновление категории диагноза через PATCH."""
        category = self.categories[0]
        detail_url = reverse("diagnosiscategory-detail", kwargs={"id": category.id})
        payload = {"description": "Partially updated description"}
        response = self.client.patch(detail_url, payload, format="json")
        self.assertEqual(response.status_code, 200)
        data = response.data

        self.assertEqual(data["description"], "Partially updated description")
        # Поле name должно остаться неизменным
        self.assertEqual(data["name"], category.name)

    def test_destroy(self):
        """Проверяем удаление категории диагноза через DELETE."""
        category = self.categories[0]
        detail_url = reverse("diagnosiscategory-detail", kwargs={"id": category.id})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, 204)
        exists = DiagnosisCategory.objects.filter(id=category.id).exists()
        self.assertFalse(exists)
