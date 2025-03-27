import datetime
from django.test import TestCase
from rest_framework import status
from rest_framework.exceptions import ValidationError
from apps.medical_activity.models import DoctorAppointment
from apps.medical_activity.serializers import DoctorAppointmentSerializer
from apps.clients.models import Patient
from apps.staffing.models import Employee


class DoctorAppointmentSerializerTestCase(TestCase):
    def setUp(self):
        # Создаем объекты, необходимые для создания приема
        self.patient = Patient.objects.create(first_name="John", last_name="Doe")
        self.assigned_doctor = Employee.objects.create(
            first_name="Alice",
            last_name="Smith",
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
            gender="M",
            date_of_birth="1975-03-03",
            snils="555-666-777 88",
            inn="0987654321",
            registration_address="Address 3",
            actual_address="Address 4",
            email="bob@example.com",
            phone="+1987654321"
        )
        # Формируем корректный набор данных для создания приема.
        self.valid_data = {
            "patient": self.patient.pk,
            "assigned_doctor": self.assigned_doctor.pk,
            "signed_by": self.signed_by.pk,
            "is_first_appointment": True,
            "is_closed": False,
            "reason_for_inspection": "Routine check-up",
            "inspection_choice": "no_inspection",  # Предполагается, что это один из допустимых вариантов
            "appointment_date": "2023-03-15",
            "start_time": "09:00:00",
            "end_time": "17:00:00",
            # medical_card можно опустить, если он не обязателен
        }

    def test_create_appointment_valid(self):
        """Проверяет создание приема с валидными данными."""
        serializer = DoctorAppointmentSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        appointment = serializer.save()
        self.assertIsInstance(appointment, DoctorAppointment)
        self.assertEqual(appointment.patient.pk, self.patient.pk)
        self.assertEqual(appointment.assigned_doctor.pk, self.assigned_doctor.pk)
        self.assertEqual(appointment.signed_by.pk, self.signed_by.pk)
        self.assertEqual(appointment.reason_for_inspection, "Routine check-up")
        self.assertEqual(appointment.inspection_choice, "no_inspection")
        # Проверяем дату и время
        self.assertEqual(appointment.appointment_date, datetime.date(2023, 3, 15))
        self.assertEqual(appointment.start_time, datetime.time(9, 0, 0))
        self.assertEqual(appointment.end_time, datetime.time(17, 0, 0))

    def test_update_appointment_valid(self):
        """Проверяет корректное частичное обновление приема."""
        # Создаем первоначальный прием
        serializer = DoctorAppointmentSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        appointment = serializer.save()
        # Обновляем поля
        update_data = {
            "reason_for_inspection": "Updated reason",
            "start_time": "10:00:00",
            "end_time": "18:00:00"
        }
        serializer_update = DoctorAppointmentSerializer(instance=appointment, data=update_data, partial=True)
        self.assertTrue(serializer_update.is_valid(), serializer_update.errors)
        updated_appointment = serializer_update.save()
        self.assertEqual(updated_appointment.reason_for_inspection, "Updated reason")
        self.assertEqual(updated_appointment.start_time, datetime.time(10, 0, 0))
        self.assertEqual(updated_appointment.end_time, datetime.time(18, 0, 0))

    def test_unknown_field_error(self):
        """Проверяет, что передача неизвестного поля вызывает ошибку валидации."""
        data = self.valid_data.copy()
        data["unknown_field"] = "unexpected value"
        serializer = DoctorAppointmentSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("unknown_field", serializer.errors)
        self.assertEqual(serializer.errors["unknown_field"][0], "This field is not allowed.")

    def test_strict_char_field_validation(self):
        """Проверяет, что если для поля reason_for_inspection передано не строковое значение, выбрасывается ошибка."""
        data = self.valid_data.copy()
        data["reason_for_inspection"] = 12345  # не строка
        serializer = DoctorAppointmentSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("reason_for_inspection", serializer.errors)
        self.assertEqual(serializer.errors["reason_for_inspection"][0], "This field must be a string.")
