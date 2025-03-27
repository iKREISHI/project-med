import datetime
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from apps.medical_activity.models import DoctorAppointment
from apps.medical_activity.serializers import DoctorAppointmentSerializer
from apps.medical_activity.service import DoctorAppointmentService
from apps.clients.models import Patient
from apps.staffing.models import Employee

User = get_user_model()


class DoctorAppointmentViewSetTestCase(APITestCase):
    def setUp(self):
        # Создаем суперпользователя для прохождения проверки permissions
        self.admin_user = User.objects.create_superuser(username='admin', password='adminpass')
        self.client.force_authenticate(user=self.admin_user)

        # Создаем связанные объекты, необходимые для создания приема
        self.patient = Patient.objects.create(first_name="John", last_name="Doe")
        self.assigned_doctor = Employee.objects.create(
            first_name="Alice",
            last_name="Smith",
            gender="F",
            date_of_birth="1980-01-01",
            snils="111-222-333 44",
            inn="1234567890",
            registration_address="Address 1",
            actual_address="Address 2",
            email="alice@example.com",
            phone="+1234567890"
        )
        self.signed_by = Employee.objects.create(
            first_name="Bob",
            last_name="Brown",
            gender="M",
            date_of_birth="1975-03-03",
            snils="555-666-777 88",
            inn="0987654321",
            registration_address="Address 3",
            actual_address="Address 4",
            email="bob@example.com",
            phone="+1987654321"
        )

        # Формируем корректный набор данных для создания приема
        # В запросах через API передаем значения для ForeignKey как первичные ключи (id)
        self.valid_data = {
            "patient": self.patient.pk,
            "assigned_doctor": self.assigned_doctor.pk,
            "signed_by": self.signed_by.pk,
            "is_first_appointment": True,
            "is_closed": False,
            "reason_for_inspection": "Routine check-up",
            "inspection_choice": "no_inspection",
            "appointment_date": "2023-03-15",
            "start_time": "09:00:00",
            "end_time": "17:00:00"
            # medical_card можно оставить пустым (null)
        }

        # Предполагается, что DoctorAppointmentViewSet зарегистрирован с basename 'doctorappointment'
        self.list_url = reverse('doctorappointment-list')

    def create_appointment(self, data=None):
        if data is None:
            data = self.valid_data
        response = self.client.post(self.list_url, data, format="json")
        return response

    def test_list_appointments(self):
        """Проверяем, что list endpoint возвращает приемы с пагинацией."""
        # Создаем 15 приемов, изменяя дату для проверки сортировки
        for i in range(15):
            data = self.valid_data.copy()
            # Изменяем дату, чтобы гарантировать уникальность
            data["appointment_date"] = f"2023-03-{15 + i:02d}"
            self.create_appointment(data)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data_response = response.data
        # Проверяем наличие ключей пагинации
        self.assertIn("count", data_response)
        self.assertIn("next", data_response)
        self.assertIn("previous", data_response)
        self.assertIn("results", data_response)
        self.assertEqual(data_response["count"], 15)
        # По умолчанию на странице 10 записей
        self.assertEqual(len(data_response["results"]), 10)

    def test_retrieve_appointment_valid(self):
        """Проверяем получение существующего приема по id."""
        response_create = self.create_appointment()
        self.assertEqual(response_create.status_code, status.HTTP_201_CREATED)
        appointment_id = response_create.data["id"]
        detail_url = reverse('doctorappointment-detail', kwargs={'id': appointment_id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["reason_for_inspection"], "Routine check-up")

    def test_retrieve_appointment_not_found(self):
        """Проверяем, что при запросе несуществующего приема возвращается 404."""
        detail_url = reverse('doctorappointment-detail', kwargs={'id': 999999})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["detail"], "Прием не найден.")

    def test_create_appointment_valid(self):
        """Проверяем создание приема через POST с корректными данными."""
        response = self.create_appointment()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        appointment_id = response.data.get("id")
        appointment = DoctorAppointment.objects.get(id=appointment_id)
        self.assertEqual(appointment.reason_for_inspection, "Routine check-up")
        self.assertEqual(appointment.inspection_choice, "no_inspection")
        self.assertEqual(appointment.appointment_date, datetime.date(2023, 3, 15))
        self.assertEqual(appointment.start_time, datetime.time(9, 0, 0))
        self.assertEqual(appointment.end_time, datetime.time(17, 0, 0))

    def test_create_appointment_invalid(self):
        """Проверяем создание приема с недопустимыми данными (например, пустая дата приема)."""
        invalid_data = self.valid_data.copy()
        invalid_data["appointment_date"] = ""
        response = self.client.post(self.list_url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("appointment_date", response.data)

    def test_update_appointment_valid(self):
        """Проверяем частичное обновление приема через PATCH."""
        response_create = self.create_appointment()
        self.assertEqual(response_create.status_code, status.HTTP_201_CREATED)
        appointment_id = response_create.data["id"]
        detail_url = reverse('doctorappointment-detail', kwargs={'id': appointment_id})
        update_data = {
            "reason_for_inspection": "Updated reason",
            "start_time": "10:00:00",
            "end_time": "18:00:00"
        }
        response_update = self.client.patch(detail_url, update_data, format="json")
        self.assertEqual(response_update.status_code, status.HTTP_200_OK)
        appointment = DoctorAppointment.objects.get(id=appointment_id)
        self.assertEqual(appointment.reason_for_inspection, "Updated reason")
        self.assertEqual(appointment.start_time, datetime.time(10, 0, 0))
        self.assertEqual(appointment.end_time, datetime.time(18, 0, 0))

    def test_destroy_appointment_valid(self):
        """Проверяем удаление приема через DELETE запрос."""
        response_create = self.create_appointment()
        self.assertEqual(response_create.status_code, status.HTTP_201_CREATED)
        appointment_id = response_create.data["id"]
        detail_url = reverse('doctorappointment-detail', kwargs={'id': appointment_id})
        response_destroy = self.client.delete(detail_url)
        self.assertEqual(response_destroy.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(DoctorAppointment.objects.filter(id=appointment_id).exists())
