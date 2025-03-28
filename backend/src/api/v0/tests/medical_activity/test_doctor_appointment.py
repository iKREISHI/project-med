import datetime
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.medical_activity.models import DoctorAppointment, ReceptionTemplate
from apps.medical_activity.serializers import DoctorAppointmentSerializer
from apps.staffing.models import Employee, Specialization, ReceptionTime
from apps.clients.models import Patient

User = get_user_model()


class DoctorAppointmentViewSetTests(APITestCase):
    def setUp(self):
        # Создаем связанные объекты
        self.patient = Patient.objects.create(first_name="John", last_name="Doe")

        self.specialization = Specialization.objects.create(
            title="Test Specialization",
            description="Описание специализации"
        )
        self.reception_template = ReceptionTemplate.objects.create(
            name="Template 1",
            description="Описание шаблона",
            html="<html>Test</html>",
            specialization=self.specialization,
            fields={"field1": "value1"}
        )
        self.assigned_doctor = Employee.objects.create(
            first_name="Alice",
            last_name="Smith",
            patronymic="A.",
            gender="F",
            date_of_birth="1980-05-05",
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
            patronymic="B.",
            gender="M",
            date_of_birth="1975-03-03",
            snils="555-666-777 88",
            inn="0987654321",
            registration_address="Address 3",
            actual_address="Address 4",
            email="bob@example.com",
            phone="+1987654321"
        )


        # Данные для создания объекта в БД – передаем экземпляры моделей
        self.valid_data_model = {
            "patient": self.patient,
            "reception_template": self.reception_template,
            "assigned_doctor": self.assigned_doctor,
            "signed_by": self.signed_by,
            "is_first_appointment": True,
            "is_closed": False,
            "reason_for_inspection": "Routine check-up",
            "inspection_choice": "no_inspection",
            "appointment_date": datetime.date(2023, 3, 15),
            "start_time": datetime.time(9, 0, 0),
            "end_time": datetime.time(17, 0, 0),
        }

        self.reception_time = ReceptionTime.objects.create(
            reception_day=timezone.now().date() + datetime.timedelta(days=1),
            start_time=datetime.time(8, 0, 0),
            end_time=datetime.time(1812, 0, 0),
            doctor=self.assigned_doctor,
        )

        # Данные для API-запросов – передаем первичные ключи
        self.valid_data_api = {
            "patient": self.patient.pk,
            "reception_template": self.reception_template.pk,
            "assigned_doctor": self.assigned_doctor.pk,
            "signed_by": self.signed_by.pk,
            "is_first_appointment": True,
            "is_closed": False,
            "reason_for_inspection": "Routine check-up",
            "inspection_choice": "no_inspection",
            "appointment_date": timezone.now().date() + datetime.timedelta(days=1),
            "start_time": "09:00:00",
            "end_time": "17:00:00",
        }
        # Создаем существующий прием для тестов retrieve, update, destroy
        self.appointment = DoctorAppointment.objects.create(**self.valid_data_model)
        # URL-адреса (lookup_field = 'id')
        self.list_url = reverse('doctorappointment-list')
        self.detail_url = reverse('doctorappointment-detail', kwargs={'id': self.appointment.id})

    def create_user_with_perms(self, perms):
        """
        Создает тестового пользователя и назначает ему указанные разрешения.
        Разрешения: view_doctorappointment, add_doctorappointment,
                     change_doctorappointment, delete_doctorappointment.
        """
        user = User.objects.create_user(username='testuser', password='testpass')
        for codename in perms:
            permission = Permission.objects.get(codename=codename)
            user.user_permissions.add(permission)
        user.save()
        return user

    # LIST
    def test_list_without_view_permission(self):
        """Без разрешения view_doctorappointment список должен возвращать 403."""
        user = self.create_user_with_perms([])
        self.client.force_authenticate(user=user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_with_view_permission(self):
        """С разрешением view_doctorappointment список возвращает 200 и данные с пагинацией."""
        user = self.create_user_with_perms(['view_doctorappointment'])
        self.client.force_authenticate(user=user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertGreaterEqual(len(response.data['results']), 1)

    # RETRIEVE
    def test_retrieve_without_view_permission(self):
        """Без разрешения view_doctorappointment детали должны возвращать 403."""
        user = self.create_user_with_perms([])
        self.client.force_authenticate(user=user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_with_view_permission(self):
        """С разрешением view_doctorappointment можно получить детали приема."""
        user = self.create_user_with_perms(['view_doctorappointment'])
        self.client.force_authenticate(user=user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = DoctorAppointmentSerializer(self.appointment)
        self.assertEqual(response.data, serializer.data)

    def test_retrieve_nonexistent(self):
        """Запрос несуществующего приема возвращает 404 с сообщением."""
        user = self.create_user_with_perms(['view_doctorappointment'])
        self.client.force_authenticate(user=user)
        url = reverse('doctorappointment-detail', kwargs={'id': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data.get("detail"), "Прием не найден.")

    # CREATE
    def test_create_without_add_permission(self):
        """Без разрешения add_doctorappointment создание приема недоступно (403)."""
        user = self.create_user_with_perms(['view_doctorappointment'])
        self.client.force_authenticate(user=user)
        response = self.client.post(self.list_url, self.valid_data_api, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_with_add_permission(self):
        """С разрешением add_doctorappointment создание приема проходит (201)."""
        user = self.create_user_with_perms(['add_doctorappointment', 'view_doctorappointment'])
        self.client.force_authenticate(user=user)
        data = self.valid_data_api.copy()
        data["appointment_date"] = "2023-04-01"
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(DoctorAppointment.objects.filter(appointment_date="2023-04-01").exists())

    # UPDATE (PUT)
    def test_update_without_change_permission(self):
        """Без разрешения change_doctorappointment обновление недоступно (403)."""
        user = self.create_user_with_perms(['view_doctorappointment'])
        self.client.force_authenticate(user=user)
        data = self.valid_data_api.copy()
        data["appointment_date"] = "2023-05-01"
        response = self.client.put(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_with_change_permission(self):
        """С разрешением change_doctorappointment обновление проходит успешно (200)."""
        user = self.create_user_with_perms(['change_doctorappointment', 'view_doctorappointment'])
        self.client.force_authenticate(user=user)
        data = self.valid_data_api.copy()
        data["appointment_date"] = "2023-06-01"
        response = self.client.put(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.appointment.refresh_from_db()
        self.assertEqual(self.appointment.appointment_date, datetime.date(2023, 6, 1))

    # PARTIAL UPDATE (PATCH)
    def test_partial_update_with_change_permission(self):
        """С разрешением change_doctorappointment частичное обновление проходит (200)."""
        user = self.create_user_with_perms(['change_doctorappointment', 'view_doctorappointment'])
        self.client.force_authenticate(user=user)
        data = {"reason_for_inspection": "Updated reason"}
        response = self.client.patch(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.appointment.refresh_from_db()
        self.assertEqual(self.appointment.reason_for_inspection, "Updated reason")

    # DESTROY
    def test_destroy_without_delete_permission(self):
        """Без разрешения delete_doctorappointment удаление недоступно (403)."""
        user = self.create_user_with_perms(['view_doctorappointment'])
        self.client.force_authenticate(user=user)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_destroy_with_delete_permission(self):
        """С разрешением delete_doctorappointment удаление проходит успешно (204)."""
        user = self.create_user_with_perms(['delete_doctorappointment', 'view_doctorappointment'])
        self.client.force_authenticate(user=user)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(DoctorAppointment.objects.filter(id=self.appointment.id).exists())

    def test_destroy_nonexistent(self):
        """Попытка удалить несуществующий прием возвращает 404 с сообщением."""
        user = self.create_user_with_perms(['delete_doctorappointment', 'view_doctorappointment'])
        self.client.force_authenticate(user=user)
        url = reverse('doctorappointment-detail', kwargs={'id': 9999})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data.get("detail"), "Прием не найден.")
