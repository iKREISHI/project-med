import datetime
from django.urls import reverse, path, include
from django.test import override_settings
from rest_framework.routers import DefaultRouter
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from unittest.mock import patch
from apps.medical_activity.models import Shift
from apps.staffing.models import Employee
from api.v0.views.medical_activity.shifts import ShiftViewSet

User = get_user_model()

# Определяем временный роутер и urlpatterns для тестирования
router = DefaultRouter()
router.register(r'shifts', ShiftViewSet, basename='shift')
urlpatterns = router.urls


@override_settings(ROOT_URLCONF=__name__)
class ShiftViewSetTests(APITestCase):
    def setUp(self):
        # Создаем суперпользователя для прохождения permissions
        self.user = User.objects.create_superuser(
            username="admin", password="pass"
        )
        self.client.force_authenticate(user=self.user)

        # Патчим метод get_short_name на уровне класса, чтобы он всегда возвращал "Dr. Smith"
        patcher = patch('apps.staffing.models.Employee.get_short_name', return_value="Dr. Smith")
        self.mock_get_short_name = patcher.start()
        self.addCleanup(patcher.stop)

        # Создаем сотрудника, который будет использоваться как врач для смен
        self.doctor = Employee.objects.create()

        # Создаем 15 объектов Shift для тестирования пагинации
        self.shifts = []
        for i in range(15):
            shift = Shift.objects.create(
                doctor=self.doctor,
                start_time=datetime.datetime(2025, 3, 26, 8, 0) + datetime.timedelta(days=i),
                end_time=datetime.datetime(2025, 3, 26, 16, 0) + datetime.timedelta(days=i)
            )
            self.shifts.append(shift)

        # Получаем URL для list эндпоинта
        self.list_url = reverse("shift-list")

    def test_list_pagination(self):
        """Проверяем, что list-эндпоинт возвращает пагинированный список смен."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 200)
        data = response.data

        # Проверяем наличие ключей пагинации
        self.assertIn("count", data)
        self.assertIn("next", data)
        self.assertIn("results", data)
        self.assertEqual(data["count"], 15)
        self.assertEqual(len(data["results"]), 10)

        # Проверяем изменение размера страницы через параметр page_size
        response = self.client.get(self.list_url, {"page_size": 5})
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data["results"]), 5)

    def test_retrieve(self):
        """Проверяем получение смены по id."""
        shift = self.shifts[0]
        detail_url = reverse("shift-detail", kwargs={"id": shift.id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, 200)
        data = response.data

        self.assertEqual(data["id"], shift.id)
        self.assertEqual(data["doctor"], self.doctor.id)
        expected_start = shift.start_time.strftime('%Y-%m-%d %H:%M')
        expected_end = shift.end_time.strftime('%Y-%m-%d %H:%M')
        self.assertEqual(data["start_time"], expected_start)
        self.assertEqual(data["end_time"], expected_end)
        # Проверяем вычисляемое поле doctor_name, оно должно вернуть "Dr. Smith"
        self.assertEqual(data.get("doctor_name"), "Dr. Smith")
        self.assertTrue(data.get("shift_str"))

    def test_create(self):
        """Проверяем создание новой смены через POST."""
        payload = {
            "doctor": self.doctor.id,
            "start_time": "2025-04-01 08:00",
            "end_time": "2025-04-01 16:00"
        }
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, 201)
        data = response.data
        self.assertEqual(data["doctor"], self.doctor.id)
        self.assertEqual(data["start_time"], "2025-04-01 08:00")
        self.assertEqual(data["end_time"], "2025-04-01 16:00")
        # Проверяем, что вычисляемое поле doctor_name возвращает "Dr. Smith"
        self.assertEqual(data.get("doctor_name"), "Dr. Smith")
        self.assertTrue(data.get("shift_str"))

    def test_update(self):
        """Проверяем полное обновление смены через PUT."""
        shift = self.shifts[0]
        detail_url = reverse("shift-detail", kwargs={"id": shift.id})
        payload = {
            "doctor": self.doctor.id,
            "start_time": "2025-05-01 08:00",
            "end_time": "2025-05-01 16:00"
        }
        response = self.client.put(detail_url, payload, format="json")
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["start_time"], "2025-05-01 08:00")
        self.assertEqual(data["end_time"], "2025-05-01 16:00")

    def test_partial_update(self):
        """Проверяем частичное обновление смены через PATCH."""
        shift = self.shifts[0]
        detail_url = reverse("shift-detail", kwargs={"id": shift.id})
        payload = {
            "start_time": "2025-06-01 09:00"
        }
        response = self.client.patch(detail_url, payload, format="json")
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["start_time"], "2025-06-01 09:00")

    def test_destroy(self):
        """Проверяем удаление смены через DELETE."""
        shift = self.shifts[0]
        detail_url = reverse("shift-detail", kwargs={"id": shift.id})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, 204)
        exists = Shift.objects.filter(id=shift.id).exists()
        self.assertFalse(exists)
