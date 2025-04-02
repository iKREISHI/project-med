import datetime
from django.urls import reverse, path, include
from django.test import override_settings
from rest_framework.routers import DefaultRouter
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from unittest.mock import patch
from apps.medical_activity.models import PatientCondition
from apps.medical_activity.models.shifts import Shift
from apps.clients.models import Patient
from apps.staffing.models import Employee
from api.v0.views.medical_activity.patient_conditions import PatientConditionViewSet

User = get_user_model()

# Определяем временный роутер и urlpatterns для тестирования
router = DefaultRouter()
router.register(r'patient-conditions', PatientConditionViewSet, basename='patientcondition')
urlpatterns = router.urls


@override_settings(ROOT_URLCONF=__name__)
class PatientConditionViewSetTests(APITestCase):
    def setUp(self):
        # Создаем суперпользователя для прохождения permissions
        self.user = User.objects.create_superuser(username="admin", password="pass")
        self.client.force_authenticate(user=self.user)

        # Создаем тестового пациента и патчим его метод get_short_name для возврата "John Doe"
        self.patient = Patient.objects.create()
        patcher = patch('apps.clients.models.Patient.get_short_name', return_value="John Doe")
        self.mock_patient_get_short_name = patcher.start()
        self.addCleanup(patcher.stop)

        # Создаем тестового врача (Employee)
        self.doctor = Employee.objects.create()

        # Создаем тестовую смену, которая понадобится для PatientCondition
        self.shift = Shift.objects.create(
            doctor=self.doctor,
            start_time=datetime.datetime(2026, 3, 26, 8, 0),
            end_time=datetime.datetime(2026, 3, 26, 16, 0)
        )

        # Создаем 15 объектов PatientCondition для тестирования пагинации
        self.conditions = []
        for i in range(15):
            condition = PatientCondition.objects.create(
                patient=self.patient,
                shift=self.shift,
                description=f"Condition {i}",
                status="Stable"  # Используем один из вариантов STATUS_CHOICES, например "Stable"
            )
            self.conditions.append(condition)

        # Получаем URL для list эндпоинта
        self.list_url = reverse("patientcondition-list")

    def test_list_pagination(self):
        """Проверяем, что list-эндпоинт возвращает пагинированный список состояний пациента."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 200)
        data = response.data

        # Проверяем наличие ключей пагинации: count, next, results
        self.assertIn("count", data)
        self.assertIn("next", data)
        self.assertIn("results", data)
        self.assertEqual(data["count"], 15)
        # Предполагаем, что по умолчанию page_size = 10
        self.assertEqual(len(data["results"]), 10)

        # Проверяем изменение размера страницы через параметр page_size
        response = self.client.get(self.list_url, {"page_size": 5})
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data["results"]), 5)

    def test_retrieve(self):
        """Проверяем получение состояния пациента по id."""
        condition = self.conditions[0]
        detail_url = reverse("patientcondition-detail", kwargs={"id": condition.id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, 200)
        data = response.data

        self.assertEqual(data["id"], condition.id)
        self.assertEqual(data["patient"], self.patient.id)
        self.assertEqual(data["shift"], self.shift.id)
        self.assertEqual(data["description"], condition.description)
        self.assertEqual(data["status"], condition.status)

        # Проверяем вычисляемые поля
        self.assertEqual(data.get("patient_name"), "John Doe")
        self.assertEqual(data.get("shift_str"), str(self.shift))
        # Формируем ожидаемое строковое представление, учитывая, что date генерируется автоматически
        expected_date = condition.date.strftime('%Y-%m-%d %H:%M')
        expected_condition_str = f"John Doe - {condition.status} - {expected_date}"
        self.assertEqual(data.get("condition_str"), expected_condition_str)

    def test_create(self):
        """Проверяем создание нового состояния пациента через POST."""
        payload = {
            "patient": self.patient.id,
            "shift": self.shift.id,
            "description": "New condition",
            "status": "Stable"
        }
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, 201)
        data = response.data
        self.assertEqual(data["patient"], self.patient.id)
        self.assertEqual(data["shift"], self.shift.id)
        self.assertEqual(data["description"], "New condition")
        self.assertEqual(data["status"], "Stable")
        self.assertEqual(data.get("patient_name"), "John Doe")
        self.assertEqual(data.get("shift_str"), str(self.shift))
        # Проверяем, что condition_str соответствует формату
        expected_condition_str = f"John Doe - Stable - {data['date']}"
        self.assertEqual(data.get("condition_str"), expected_condition_str)

    def test_update(self):
        """Проверяем полное обновление состояния пациента через PUT."""
        condition = self.conditions[0]
        detail_url = reverse("patientcondition-detail", kwargs={"id": condition.id})
        payload = {
            "patient": self.patient.id,
            "shift": self.shift.id,
            "description": "Updated condition",
            "status": "Worsening"
        }
        response = self.client.put(detail_url, payload, format="json")
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["description"], "Updated condition")
        self.assertEqual(data["status"], "Worsening")

    def test_partial_update(self):
        """Проверяем частичное обновление состояния пациента через PATCH."""
        condition = self.conditions[0]
        detail_url = reverse("patientcondition-detail", kwargs={"id": condition.id})
        payload = {
            "description": "Partially updated condition"
        }
        response = self.client.patch(detail_url, payload, format="json")
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["description"], "Partially updated condition")

    def test_destroy(self):
        """Проверяем удаление состояния пациента через DELETE."""
        condition = self.conditions[0]
        detail_url = reverse("patientcondition-detail", kwargs={"id": condition.id})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, 204)
        exists = PatientCondition.objects.filter(id=condition.id).exists()
        self.assertFalse(exists)
