import datetime
from django.urls import reverse, path, include
from django.test import override_settings
from django.utils import timezone
from rest_framework.routers import DefaultRouter
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from unittest.mock import patch

from apps.medical_activity.models import HospitalStays
from apps.medical_activity.serializers import HospitalStaysSerializer
from apps.medical_activity.models import DoctorAppointment
from apps.medical_activity.models import ReceptionTemplate
from apps.staffing.models import Employee, Specialization, ReceptionTime
from apps.clients.models import Patient
from api.v0.views.medical_activity.hospital_stays import HospitalStaysViewSet

User = get_user_model()

# Определяем временный роутер и urlpatterns для тестирования
router = DefaultRouter()
router.register(r'hospital-stays', HospitalStaysViewSet, basename='hospitalstays')
urlpatterns = router.urls

@override_settings(ROOT_URLCONF=__name__)
class HospitalStaysViewSetTests(APITestCase):
    def setUp(self):
        # Создаем суперпользователя
        self.user = User.objects.create_superuser(username="admin", password="pass")
        self.client.force_authenticate(user=self.user)

        # Создаем тестового пациента и переопределяем его метод get_short_name для возврата "John Doe"
        self.patient = Patient.objects.create()
        patcher = patch('apps.clients.models.Patient.get_short_name', return_value="John Doe")
        self.mock_patient_get_short_name = patcher.start()
        self.addCleanup(patcher.stop)

        # Создаем тестового сотрудника (врач) для приема
        self.employee = Employee.objects.create()

        # Для создания DoctorAppointment создадим минимальную специализацию и ReceptionTemplate
        self.specialization = Specialization.objects.create(title="Default Specialization")
        self.reception_template = ReceptionTemplate.objects.create(
            name="Default Template",
            specialization=self.specialization
        )

        self.reception_time = ReceptionTime.objects.create(
            reception_day=timezone.now().date() + datetime.timedelta(days=1),
            start_time=datetime.time(8, 0, 0),
            end_time=datetime.time(18, 0, 0),
            doctor=self.employee,
        )

        # Создаем минимальный объект DoctorAppointment с обязательными полями
        self.appointment = DoctorAppointment.objects.create(
            signed_by=self.employee,
            appointment_date=timezone.now().date() + datetime.timedelta(days=1),
            start_time=datetime.time(9, 0),
            end_time=datetime.time(10, 0),
            reception_template=self.reception_template,
            assigned_doctor=self.employee,
        )
        # Переопределяем строковое представление приема для тестирования
        patcher_app = patch.object(DoctorAppointment, '__str__', return_value="Appointment 1")
        self.mock_app_str = patcher_app.start()
        self.addCleanup(patcher_app.stop)

        # Создаем 15 объектов госпитализации для тестирования пагинации
        self.hospital_stays = []
        self.start_date = datetime.date(2025, 3, 26)
        self.end_date = datetime.date(2025, 3, 30)
        for i in range(15):
            stay = HospitalStays.objects.create(
                patient=self.patient,
                description=f"Initial description {i}",
                start_date=self.start_date,
                end_date=self.end_date,
                ward_number=f"{100+i}",
                appointment=self.appointment
            )
            self.hospital_stays.append(stay)

        self.list_url = reverse("hospitalstays-list")

    def test_list_pagination(self):
        """Проверяем, что list-эндпоинт возвращает пагинированный список госпитализаций."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 200)
        data = response.data

        # Проверяем наличие ключей пагинации: count, next, results
        self.assertIn("count", data)
        self.assertIn("next", data)
        self.assertIn("results", data)
        self.assertEqual(data["count"], 15)
        # По умолчанию CustomPagination может выдавать 10 элементов на странице
        self.assertEqual(len(data["results"]), 10)

        # Проверяем изменение размера страницы через параметр page_size
        response = self.client.get(self.list_url, {"page_size": 5})
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data["results"]), 5)

    def test_retrieve(self):
        """Проверяем получение госпитализации по id."""
        stay = self.hospital_stays[0]
        detail_url = reverse("hospitalstays-detail", kwargs={"id": stay.id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, 200)
        data = response.data

        self.assertEqual(data["id"], stay.id)
        self.assertEqual(data["patient"], self.patient.id)
        self.assertEqual(data["appointment"], self.appointment.id)
        self.assertEqual(data["description"], stay.description)
        self.assertEqual(data["ward_number"], stay.ward_number)
        # Проверяем форматирование дат
        self.assertEqual(data["start_date"], self.start_date.strftime('%Y-%m-%d'))
        self.assertEqual(data["end_date"], self.end_date.strftime('%Y-%m-%d'))
        # Вычисляемые поля (если они определены в сериализаторе)
        # Например, hospital_stay_str – согласно __str__: "<patient_short_name> - <start_date> - <ward_number>"
        expected_str = f"John Doe - {self.start_date.strftime('%Y-%m-%d')} - {stay.ward_number}"
        self.assertEqual(data.get("hospital_stay_str"), expected_str)

    def test_create(self):
        """Проверяем создание новой госпитализации через POST."""
        payload = {
            "patient": self.patient.id,
            "appointment": self.appointment.id,
            "description": "New hospital stay",
            "start_date": "2025-04-01",
            "end_date": "2025-04-05",
            "ward_number": "105"
        }
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, 201)
        data = response.data
        self.assertEqual(data["patient"], self.patient.id)
        self.assertEqual(data["appointment"], self.appointment.id)
        self.assertEqual(data["description"], "New hospital stay")
        self.assertEqual(data["start_date"], "2025-04-01")
        self.assertEqual(data["end_date"], "2025-04-05")
        self.assertEqual(data["ward_number"], "105")
        # Проверяем вычисляемое поле hospital_stay_str
        expected_str = f"John Doe - 2025-04-01 - 105"
        self.assertEqual(data.get("hospital_stay_str"), expected_str)

    def test_update(self):
        """Проверяем полное обновление госпитализации через PUT."""
        stay = self.hospital_stays[0]
        detail_url = reverse("hospitalstays-detail", kwargs={"id": stay.id})
        payload = {
            "patient": self.patient.id,
            "appointment": self.appointment.id,
            "description": "Updated hospital stay",
            "start_date": "2025-05-01",
            "end_date": "2025-05-05",
            "ward_number": "110"
        }
        response = self.client.put(detail_url, payload, format="json")
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["description"], "Updated hospital stay")
        self.assertEqual(data["start_date"], "2025-05-01")
        self.assertEqual(data["end_date"], "2025-05-05")
        self.assertEqual(data["ward_number"], "110")

    def test_partial_update(self):
        """Проверяем частичное обновление госпитализации через PATCH."""
        stay = self.hospital_stays[0]
        detail_url = reverse("hospitalstays-detail", kwargs={"id": stay.id})
        payload = {
            "description": "Partially updated hospital stay"
        }
        response = self.client.patch(detail_url, payload, format="json")
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["description"], "Partially updated hospital stay")

    def test_destroy(self):
        """Проверяем удаление госпитализации через DELETE."""
        stay = self.hospital_stays[0]
        detail_url = reverse("hospitalstays-detail", kwargs={"id": stay.id})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, 204)
        exists = HospitalStays.objects.filter(id=stay.id).exists()
        self.assertFalse(exists)
