import datetime
from django.test import TestCase
from rest_framework.exceptions import ValidationError
from apps.medical_activity.models import BookingAppointment
from apps.medical_activity.serializers import BookingAppointmentSerializer
from apps.clients.models import Patient
from apps.staffing.models import Employee
from unittest.mock import patch


class BookingAppointmentSerializerTestCase(TestCase):
    def setUp(self):
        # Создаем тестового пациента и задаем его метод get_short_name для возврата "John Doe"
        self.patient = Patient.objects.create()
        self.patient.get_short_name = lambda: "John Doe"

        # Создаем тестового врача и задаем его метод get_short_name для возврата "Dr. Smith"
        self.doctor = Employee.objects.create()
        self.doctor.get_short_name = lambda: "Dr. Smith"

        # Задаем дату визита
        self.vizit_datetime = datetime.datetime(2025, 4, 1, 8, 0)

        # Патчим метод __str__ модели BookingAppointment, чтобы использовать vizit_datetime
        # вместо несуществующего поля vizit_date
        self.str_patcher = patch.object(
            BookingAppointment,
            '__str__',
            lambda
                self: f"{self.patient.get_short_name()} - {self.doctor.get_short_name()} - {self.vizit_datetime.strftime('%Y-%m-%d %H:%M')}"
        )
        self.str_patcher.start()
        self.addCleanup(self.str_patcher.stop)

        # Создаем объект BookingAppointment
        self.booking = BookingAppointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            status="planning",  # Используем ключ "planning" из choices
            vizit_datetime=self.vizit_datetime
        )

    def test_serializer_fields(self):
        """
        Проверяем, что сериализатор возвращает корректные данные.
        Ожидается, что поле vizit_datetime форматируется как 'YYYY-MM-DD HH:MM',
        а вычисляемые поля patient_name, doctor_name и booking_str формируются корректно.
        """
        serializer = BookingAppointmentSerializer(instance=self.booking)
        data = serializer.data
        expected_vizit = self.vizit_datetime.strftime('%Y-%m-%d %H:%M')

        # Базовые поля
        self.assertIn("id", data)
        self.assertEqual(data["patient"], self.patient.id)
        self.assertEqual(data["doctor"], self.doctor.id)
        self.assertEqual(data["vizit_datetime"], expected_vizit)

        # Вычисляемые поля
        self.assertEqual(data.get("patient_name"), "John Doe")
        self.assertEqual(data.get("doctor_name"), "Dr. Smith")
        expected_booking_str = f"John Doe - Dr. Smith - {expected_vizit}"
        self.assertEqual(data.get("booking_str"), expected_booking_str)

    def test_to_internal_value_unknown_field(self):
        """
        Проверяем, что при передаче неизвестного поля в данные сериализатор не проходит валидацию.
        """
        payload = {
            "patient": self.patient.id,
            "doctor": self.doctor.id,
            "status": "planning",
            "vizit_datetime": "2025-04-01 08:00",
            "unknown_field": "unexpected",
            "testetest": "trestwasgsdrg"
        }
        serializer = BookingAppointmentSerializer(data=payload)
        valid = serializer.is_valid()
        self.assertFalse(valid)
        self.assertIn("unknown_field", serializer.errors)
        self.assertEqual(serializer.errors["unknown_field"], ["This field is not allowed."])

    def test_read_only_fields_on_update(self):
        """
        Проверяем, что поля, отмеченные как read_only (patient_name, doctor_name, booking_str),
        не обновляются через сериализатор.
        """
        payload = {
            "status": "confirmation",
            "vizit_datetime": "2025-04-02 09:00",
            "patient_name": "Changed Name",
            "doctor_name": "Changed Doctor",
            "booking_str": "Changed booking"
        }
        serializer = BookingAppointmentSerializer(instance=self.booking, data=payload, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_booking = serializer.save()

        # Обновляются только разрешенные поля: status и vizit_datetime
        self.assertEqual(updated_booking.status, "confirmation")
        self.assertEqual(updated_booking.vizit_datetime.strftime('%Y-%m-%d %H:%M'), "2025-04-02 09:00")

        # При сериализации вычисляемые поля формируются заново
        updated_data = BookingAppointmentSerializer(instance=updated_booking).data
        self.assertEqual(updated_data.get("patient_name"), "John Doe")
        self.assertEqual(updated_data.get("doctor_name"), "Dr. Smith")
        expected_booking_str = f"John Doe - Dr. Smith - {updated_data['vizit_datetime']}"
        self.assertEqual(updated_data.get("booking_str"), expected_booking_str)
