import datetime
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from apps.staffing.models import ReceptionTime
from apps.staffing.models import Employee

User = get_user_model()


class ReceptionTimeViewSetTestCase(APITestCase):
    def setUp(self):
        # Создаем суперпользователя для прохождения проверок permissions
        self.admin_user = User.objects.create_superuser(username='admin', password='adminpass')
        self.client.force_authenticate(user=self.admin_user)

        # Создаем тестового врача (Employee), который будет использоваться для поля doctor
        self.doctor = Employee.objects.create(
            first_name="Test",
            last_name="Doctor",
            gender="M",
            date_of_birth="1980-01-01",
            snils="111-222-333 44",
            inn="1234567890",
            registration_address="Some Address",
            actual_address="Some Address",
            email="doctor@example.com",
            phone="+1234567890"
        )

        # Данные для создания ReceptionTime через API: для полей ForeignKey передаем pk
        self.valid_data = {
            "doctor": self.doctor.pk,
            "reception_day": "2023-03-15",
            "start_time": "09:00:00",
            "end_time": "17:00:00"
        }

        # Получаем URL для списка через роутер (lookup_field: id)
        self.list_url = reverse('reception-time-list')

    def create_reception_time(self, data=None):
        if data is None:
            data = self.valid_data
        return self.client.post(self.list_url, data, format="json")

    def test_list_reception_times(self):
        """Проверяем, что list endpoint возвращает приемы с пагинацией."""
        # Создаем 15 записей, изменяя дату приема для уникальности
        for i in range(15):
            data = self.valid_data.copy()
            day = 15 + i
            data["reception_day"] = f"2023-03-{day:02d}"
            self.create_reception_time(data)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data_response = response.data
        self.assertIn("count", data_response)
        self.assertIn("results", data_response)
        self.assertEqual(data_response["count"], 15)
        # По умолчанию должно возвращаться 10 записей на страницу
        self.assertEqual(len(data_response["results"]), 10)

    def test_retrieve_reception_time_valid(self):
        """Проверяем получение существующей записи по id."""
        response_create = self.create_reception_time()
        self.assertEqual(response_create.status_code, status.HTTP_201_CREATED)
        reception_id = response_create.data["id"]
        detail_url = reverse('reception-time-detail', kwargs={'id': reception_id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["reception_day"], "2023-03-15")

    def test_retrieve_reception_time_not_found(self):
        """Проверяем, что при запросе несуществующей записи возвращается 404."""
        detail_url = reverse('reception-time-detail', kwargs={'id': 999999})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_reception_time_valid(self):
        """Проверяем создание записи через POST с корректными данными."""
        response = self.create_reception_time()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        reception_id = response.data.get("id")
        reception = ReceptionTime.objects.get(id=reception_id)
        self.assertEqual(reception.reception_day, datetime.date(2023, 3, 15))
        self.assertEqual(reception.start_time, datetime.time(9, 0, 0))
        self.assertEqual(reception.end_time, datetime.time(17, 0, 0))

    def test_create_reception_time_invalid(self):
        """Проверяем создание записи с недопустимыми данными (например, пустая дата приема)."""
        invalid_data = self.valid_data.copy()
        invalid_data["reception_day"] = ""
        response = self.client.post(self.list_url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("reception_day", response.data)

    def test_create_reception_time_unknown_field(self):
        """Проверяем, что при передаче неизвестного поля возвращается ошибка валидации."""
        data = self.valid_data.copy()
        data["unknown_field"] = "unexpected"
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("unknown_field", response.data)
        self.assertEqual(response.data["unknown_field"][0], "This field is not allowed.")

    def test_update_reception_time_valid(self):
        """Проверяем частичное обновление записи через PATCH."""
        response_create = self.create_reception_time()
        self.assertEqual(response_create.status_code, status.HTTP_201_CREATED)

        reception_id = response_create.data["id"]
        detail_url = reverse('reception-time-detail', kwargs={'id': reception_id})

        # Генерируем дату не раньше завтра
        min_date = timezone.now().date() + datetime.timedelta(days=1)
        update_data = {
            "reception_day": min_date.isoformat(),
            "start_time": "10:00:00",
            "end_time": "18:00:00"
        }

        response_update = self.client.patch(detail_url, update_data, format="json")

        # Проверки
        self.assertEqual(response_update.status_code, status.HTTP_200_OK)
        reception = ReceptionTime.objects.get(id=reception_id)
        self.assertEqual(reception.reception_day, min_date)
        self.assertEqual(reception.start_time, datetime.time(10, 0, 0))
        self.assertEqual(reception.end_time, datetime.time(18, 0, 0))

    def test_destroy_reception_time_valid(self):
        """Проверяем удаление записи через DELETE запрос."""
        response_create = self.create_reception_time()
        self.assertEqual(response_create.status_code, status.HTTP_201_CREATED)
        reception_id = response_create.data["id"]
        detail_url = reverse('reception-time-detail', kwargs={'id': reception_id})
        response_destroy = self.client.delete(detail_url)
        self.assertEqual(response_destroy.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(ReceptionTime.objects.filter(id=reception_id).exists())
