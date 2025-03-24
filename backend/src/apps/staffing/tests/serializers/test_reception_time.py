from django.test import TestCase
from datetime import date, time
from apps.staffing.serializers import ReceptionTimeSerializer
from apps.staffing.models import Employee

class ReceptionTimeSerializerTestCase(TestCase):
    def setUp(self):
        self.employee = Employee.objects.create(
            first_name="John",
            last_name="Doe",
            gender="M",
            date_of_birth="1990-01-01",
            snils="123-456-789 00",
            inn="1234567890",
            registration_address="Some Address",
            actual_address="Some Address",
            email="john.doe@example.com",
            phone="+1234567890"
        )

        self.valid_data = {
            "doctor": self.employee.pk,
            "reception_day": "2023-03-15",
            "start_time": "09:00:00",
            "end_time": "17:00:00"
        }

    def test_create_reception_time_valid(self):
        """Проверяет создание записи ReceptionTime с валидными данными."""
        serializer = ReceptionTimeSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        instance = serializer.save()
        self.assertEqual(instance.doctor.pk, self.employee.pk)
        self.assertEqual(instance.reception_day, date(2023, 3, 15))
        self.assertEqual(instance.start_time, time(9, 0, 0))
        self.assertEqual(instance.end_time, time(17, 0, 0))

    def test_update_reception_time_valid(self):
        """Проверяет частичное обновление записи ReceptionTime."""
        serializer = ReceptionTimeSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        instance = serializer.save()
        update_data = {
            "start_time": "10:00:00",
            "end_time": "18:00:00"
        }
        serializer_update = ReceptionTimeSerializer(instance=instance, data=update_data, partial=True)
        self.assertTrue(serializer_update.is_valid(), serializer_update.errors)
        updated_instance = serializer_update.save()
        self.assertEqual(updated_instance.start_time, time(10, 0, 0))
        self.assertEqual(updated_instance.end_time, time(18, 0, 0))

    def test_unknown_field_error(self):
        """Проверяет, что при передаче неизвестного поля возникает ошибка валидации."""
        data = self.valid_data.copy()
        data["unknown_field"] = "unexpected"
        serializer = ReceptionTimeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("unknown_field", serializer.errors)
        self.assertEqual(serializer.errors["unknown_field"][0], "This field is not allowed.")
