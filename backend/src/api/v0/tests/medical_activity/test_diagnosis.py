import datetime
from django.urls import reverse, path, include
from django.test import override_settings
from rest_framework.routers import DefaultRouter
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from apps.medical_activity.models.diagnosis import Diagnosis
from apps.medical_activity.serializers.diagnosis import DiagnosisSerializer
from api.v0.views.medical_activity.diagnosis import DiagnosisViewSet

User = get_user_model()


class DiagnosisViewSetTests(APITestCase):
    def setUp(self):
        # Создаем суперпользователя для прохождения permissions
        self.user = User.objects.create_superuser(username="admin", password="pass")
        self.client.force_authenticate(user=self.user)

        # Создаем 10 объектов Diagnosis для тестирования пагинации
        self.diagnoses = []
        for i in range(10):
            diagnosis = Diagnosis.objects.create(
                name=f"Diagnosis {i}",
                description=f"Description {i}",
                code=f"Code{i}",
                synonym=f"Synonym{i}"
            )
            self.diagnoses.append(diagnosis)

        self.list_url = reverse("diagnosis-list")

    def test_list_pagination(self):
        """Проверяем, что list-эндпоинт возвращает пагинированный список диагнозов."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 200)
        data = response.data

        # Проверяем наличие ключей пагинации: count, next, results
        self.assertIn("count", data)
        self.assertIn("next", data)
        self.assertIn("results", data)
        self.assertEqual(data["count"], 10)
        # По умолчанию CustomPagination выводит 10 элементов
        self.assertEqual(len(data["results"]), 10)

    def test_retrieve(self):
        """Проверяем получение диагноза по id."""
        diagnosis = self.diagnoses[0]
        detail_url = reverse("diagnosis-detail", kwargs={"id": diagnosis.id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, 200)
        data = response.data

        self.assertEqual(data["id"], diagnosis.id)
        self.assertEqual(data["name"], diagnosis.name)
        self.assertEqual(data["description"], diagnosis.description)
        self.assertEqual(data["code"], diagnosis.code)
        self.assertEqual(data["synonym"], diagnosis.synonym)
        # Поля date_created и date_updated должны присутствовать
        self.assertIn("date_created", data)
        self.assertIn("date_updated", data)

    def test_create(self):
        """Проверяем создание нового диагноза через POST."""
        payload = {
            "name": "New Diagnosis",
            "description": "New description",
            "code": "NewCode",
            "synonym": "NewSynonym"
        }
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, 201)
        data = response.data
        self.assertEqual(data["name"], "New Diagnosis")
        self.assertEqual(data["description"], "New description")
        self.assertEqual(data["code"], "NewCode")
        self.assertEqual(data["synonym"], "NewSynonym")
        # Проверяем, что поля read_only (id, date_created, date_updated) заполнены
        self.assertTrue(data.get("id"))
        self.assertIn("date_created", data)
        self.assertIn("date_updated", data)

    def test_create_unknown_field(self):
        """Проверяем, что при передаче неизвестного поля возникает ошибка валидации."""
        payload = {
            "name": "New Diagnosis",
            "description": "New description",
            "code": "NewCode",
            "synonym": "NewSynonym",
            "unknown_field": "unexpected"
        }
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("unknown_field", response.data)
        self.assertEqual(response.data["unknown_field"], ["This field is not allowed."])

    def test_update(self):
        """Проверяем полное обновление диагноза через PUT."""
        diagnosis = self.diagnoses[0]
        detail_url = reverse("diagnosis-detail", kwargs={"id": diagnosis.id})
        payload = {
            "name": "Updated Diagnosis",
            "description": "Updated description",
            "code": "UpdatedCode",
            "synonym": "UpdatedSynonym"
        }
        response = self.client.put(detail_url, payload, format="json")
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["name"], "Updated Diagnosis")
        self.assertEqual(data["description"], "Updated description")
        self.assertEqual(data["code"], "UpdatedCode")
        self.assertEqual(data["synonym"], "UpdatedSynonym")

    def test_partial_update(self):
        """Проверяем частичное обновление диагноза через PATCH."""
        diagnosis = self.diagnoses[0]
        detail_url = reverse("diagnosis-detail", kwargs={"id": diagnosis.id})
        payload = {"description": "Partially updated description"}
        response = self.client.patch(detail_url, payload, format="json")
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["description"], "Partially updated description")
        # Остальные поля остаются без изменений
        self.assertEqual(data["name"], diagnosis.name)

    def test_destroy(self):
        """Проверяем удаление диагноза через DELETE."""
        diagnosis = self.diagnoses[0]
        detail_url = reverse("diagnosis-detail", kwargs={"id": diagnosis.id})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, 204)
        exists = Diagnosis.objects.filter(id=diagnosis.id).exists()
        self.assertFalse(exists)
