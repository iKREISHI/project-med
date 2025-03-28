import datetime
from django.urls import reverse, path, include
from django.test import override_settings
from django.utils import timezone
from rest_framework.routers import DefaultRouter
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from unittest.mock import patch

from apps.medical_activity.models import BookingAppointment
from api.v0.views.medical_activity.booking_appointment import BookingAppointmentViewSet
from apps.clients.models import Patient
from apps.staffing.models import Employee

User = get_user_model()

# Регистрируем эндпоинт BookingAppointmentViewSet
router = DefaultRouter()
router.register(r'booking-appointments', BookingAppointmentViewSet, basename='bookingappointment')
urlpatterns = router.urls


@override_settings(ROOT_URLCONF=__name__)
class BookingAppointmentViewSetTests(APITestCase):
    def setUp(self):
        # Создаем суперпользователя и аутентифицируем его
        self.user = User.objects.create_superuser(username="admin", password="pass")
        self.client.force_authenticate(user=self.user)

        # Патчим методы get_short_name для Patient и Employee
        patcher1 = patch('apps.clients.models.Patient.get_short_name', return_value="John Doe")
        self.mock_patient_get_short_name = patcher1.start()
        self.addCleanup(patcher1.stop)

        patcher2 = patch('apps.staffing.models.Employee.get_short_name', return_value="Dr. Smith")
        self.mock_employee_get_short_name = patcher2.start()
        self.addCleanup(patcher2.stop)

        # Создаем пациента и врача
        self.patient = Patient.objects.create()
        self.doctor = Employee.objects.create()

        # Создаем базовую дату визита как aware datetime
        self.base_datetime = timezone.make_aware(datetime.datetime(2025, 4, 1, 8, 0))

        # Создаем 10 объектов BookingAppointment для тестирования
        self.bookings = []
        for i in range(10):
            vizit_dt = self.base_datetime + datetime.timedelta(days=i)
            booking = BookingAppointment.objects.create(
                patient=self.patient,
                doctor=self.doctor,
                status="planning",
                vizit_datetime=vizit_dt
            )
            self.bookings.append(booking)

        self.list_url = reverse("bookingappointment-list")

    def test_list_pagination(self):
        """Проверяем, что list-эндпоинт возвращает пагинированный список записей на прием."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertIn("count", data)
        self.assertIn("next", data)
        self.assertIn("results", data)
        self.assertEqual(data["count"], 10)
        self.assertEqual(len(data["results"]), 10)

        response = self.client.get(self.list_url, {"page_size": 5})
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(len(data["results"]), 5)

    def test_filter_by_date_range(self):
        """
        Проверяем фильтрацию по диапазону дат.
        Передаем start_date и end_date (формат YYYY-MM-DD) и проверяем, что возвращаются
        только записи, у которых vizit_datetime попадает в указанный диапазон.
        """
        # Допустим, хотим выбрать записи с индексами 2, 3, 4
        start_date = (self.base_datetime + datetime.timedelta(days=2)).strftime("%Y-%m-%d")
        end_date = (self.base_datetime + datetime.timedelta(days=4)).strftime("%Y-%m-%d")
        response = self.client.get(self.list_url, {"start_date": start_date, "end_date": end_date})
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["count"], 3)
        for item in data["results"]:
            dt = datetime.datetime.strptime(item["vizit_datetime"], "%Y-%m-%d %H:%M").date()
            self.assertGreaterEqual(dt, datetime.datetime.strptime(start_date, "%Y-%m-%d").date())
            self.assertLessEqual(dt, datetime.datetime.strptime(end_date, "%Y-%m-%d").date())

    def test_retrieve(self):
        """Проверяем получение записи на прием по id."""
        booking = self.bookings[0]
        detail_url = reverse("bookingappointment-detail", kwargs={"id": booking.id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["id"], booking.id)
        self.assertEqual(data["patient"], self.patient.id)
        self.assertEqual(data["doctor"], self.doctor.id)
        expected_dt = booking.vizit_datetime.strftime("%Y-%m-%d %H:%M")
        self.assertEqual(data["vizit_datetime"], expected_dt)
        self.assertEqual(data.get("patient_name"), "John Doe")
        self.assertEqual(data.get("doctor_name"), "Dr. Smith")
        expected_booking_str = f"John Doe - Dr. Smith - {expected_dt}"
        self.assertEqual(data.get("booking_str"), expected_booking_str)

    def test_create(self):
        """Проверяем создание новой записи на прием через POST."""
        payload = {
            "patient": self.patient.id,
            "doctor": self.doctor.id,
            "status": "planning",
            "vizit_datetime": "2025-04-15 08:00"
        }
        response = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(response.status_code, 201)
        data = response.data
        self.assertEqual(data["patient"], self.patient.id)
        self.assertEqual(data["doctor"], self.doctor.id)
        self.assertEqual(data["status"], "planning")
        self.assertEqual(data["vizit_datetime"], "2025-04-15 08:00")
        self.assertEqual(data.get("patient_name"), "John Doe")
        self.assertEqual(data.get("doctor_name"), "Dr. Smith")
        expected_booking_str = f"John Doe - Dr. Smith - 2025-04-15 08:00"
        self.assertEqual(data.get("booking_str"), expected_booking_str)

    def test_update(self):
        """Проверяем полное обновление записи на прием через PUT."""
        booking = self.bookings[0]
        detail_url = reverse("bookingappointment-detail", kwargs={"id": booking.id})
        payload = {
            "patient": self.patient.id,
            "doctor": self.doctor.id,
            "status": "confirmation",
            "vizit_datetime": "2025-04-20 09:00"
        }
        response = self.client.put(detail_url, payload, format="json")
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["status"], "confirmation")
        self.assertEqual(data["vizit_datetime"], "2025-04-20 09:00")

    def test_partial_update(self):
        """Проверяем частичное обновление записи на прием через PATCH."""
        booking = self.bookings[0]
        detail_url = reverse("bookingappointment-detail", kwargs={"id": booking.id})
        payload = {"status": "confirmation"}
        response = self.client.patch(detail_url, payload, format="json")
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data["status"], "confirmation")

    def test_destroy(self):
        """Проверяем удаление записи на прием через DELETE."""
        booking = self.bookings[0]
        detail_url = reverse("bookingappointment-detail", kwargs={"id": booking.id})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, 204)
        exists = BookingAppointment.objects.filter(id=booking.id).exists()
        self.assertFalse(exists)
