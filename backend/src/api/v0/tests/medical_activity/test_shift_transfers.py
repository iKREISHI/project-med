import datetime
from django.urls import reverse, path, include
from django.test import override_settings
from rest_framework.routers import DefaultRouter
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from unittest.mock import patch
from apps.medical_activity.models import Shift, ShiftTransfer
from apps.staffing.models import Employee
from api.v0.views.medical_activity.shift_transfers import ShiftTransferViewSet

User = get_user_model()

# Определяем временный роутер и urlpatterns для тестирования
router = DefaultRouter()
router.register(r'shift-transfers', ShiftTransferViewSet, basename='shifttransfer')
urlpatterns = router.urls

@override_settings(ROOT_URLCONF=__name__)
class ShiftTransferViewSetTests(APITestCase):
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

        # Создаем две смены для передачи
        # Создаем первую смену (from_shift)
        self.shift_from = Shift.objects.create(
            doctor=self.doctor,
            start_time=datetime.datetime(2025, 3, 26, 8, 0),
            end_time=datetime.datetime(2025, 3, 26, 16, 0)
        )
        # Создаем вторую смену (to_shift)
        self.shift_to = Shift.objects.create(
            doctor=self.doctor,
            start_time=datetime.datetime(2025, 3, 27, 8, 0),
            end_time=datetime.datetime(2025, 3, 27, 16, 0)
        )

        # Создаем 10 объектов ShiftTransfer для тестирования пагинации
        self.transfers = []
        for i in range(10):
            transfer = ShiftTransfer.objects.create(
                from_shift=self.shift_from,
                to_shift=self.shift_to,
                comment=f"Initial comment {i}"
            )
            self.transfers.append(transfer)

        # Получаем URL для list эндпоинта
        self.list_url = reverse("shifttransfer-list")

    def test_list_pagination(self):
        """Проверяем, что list-эндпоинт возвращает пагинированный список передач смен."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 200)
        data = response.data

        # Проверяем наличие ключей пагинации
        self.assertIn("count", data)
        self.assertIn("next", data)
        self.assertIn("results", data)
        self.assertEqual(data["count"], 10)
        # По умолчанию CustomPagination может выдавать 10 объектов на странице
        self.assertEqual(len(data["results"]), 10)

        # Проверяем изменение размера страницы через параметр page_size
        response = self.client.get(self.list_url, {"page_size": 5})
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data["results"]), 5)

    def test_retrieve(self):
        """Проверяем получение передачи смены по id."""
        transfer = self.transfers[0]
        detail_url = reverse("shifttransfer-detail", kwargs={"id": transfer.id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, 200)
        data = response.data

        self.assertEqual(data["id"], transfer.id)
        self.assertEqual(data["from_shift"], self.shift_from.id)
        self.assertEqual(data["to_shift"], self.shift_to.id)
        # Проверяем форматированное поле date (формат '%Y-%m-%d %H:%M')
        self.assertTrue("date" in data)
        # Проверяем вычисляемые поля: from_shift_str, to_shift_str, transfer_str
        self.assertEqual(data.get("from_shift_str"), str(self.shift_from))
        self.assertEqual(data.get("to_shift_str"), str(self.shift_to))
        self.assertEqual(data.get("transfer_str"), str(transfer))
        # Проверяем, что comment соответствует
        self.assertEqual(data.get("comment"), transfer.comment)

    def test_create(self):
        """Проверяем создание новой передачи смены через POST."""
        payload = {
            "from_shift": self.shift_from.id,
            "to_shift": self.shift_to.id,
            "comment": "New transfer comment"
        }
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, 201)
        data = response.data
        self.assertEqual(data["from_shift"], self.shift_from.id)
        self.assertEqual(data["to_shift"], self.shift_to.id)
        self.assertEqual(data["comment"], "New transfer comment")
        # Поле date генерируется автоматически, проверяем, что оно заполнено
        self.assertTrue(data.get("date"))
        # Проверяем вычисляемые поля
        self.assertEqual(data.get("from_shift_str"), str(self.shift_from))
        self.assertEqual(data.get("to_shift_str"), str(self.shift_to))
        # Вместо сравнения с id, проверяем, что transfer_str не пустое и содержит "->"
        self.assertTrue(data.get("transfer_str"))
        self.assertIn("->", data.get("transfer_str"))

    def test_update(self):
        """Проверяем полное обновление передачи смены через PUT."""
        transfer = self.transfers[0]
        detail_url = reverse("shifttransfer-detail", kwargs={"id": transfer.id})
        payload = {
            "from_shift": self.shift_from.id,
            "to_shift": self.shift_to.id,
            "comment": "Updated comment"
        }
        response = self.client.put(detail_url, payload, format="json")
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["comment"], "Updated comment")

    def test_partial_update(self):
        """Проверяем частичное обновление передачи смены через PATCH."""
        transfer = self.transfers[0]
        detail_url = reverse("shifttransfer-detail", kwargs={"id": transfer.id})
        payload = {
            "comment": "Partially updated comment"
        }
        response = self.client.patch(detail_url, payload, format="json")
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["comment"], "Partially updated comment")

    def test_destroy(self):
        """Проверяем удаление передачи смены через DELETE."""
        transfer = self.transfers[0]
        detail_url = reverse("shifttransfer-detail", kwargs={"id": transfer.id})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, 204)
        exists = ShiftTransfer.objects.filter(id=transfer.id).exists()
        self.assertFalse(exists)
