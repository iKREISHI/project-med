import datetime
from django.test import TestCase
from unittest.mock import patch
from apps.medical_activity.models import Shift
from apps.medical_activity.serializers import ShiftSerializer
from apps.staffing.models import Employee


class ShiftSerializerTestCase(TestCase):
    def setUp(self):
        # Создаем тестового сотрудника.
        self.employee = Employee.objects.create()
        # Патчим метод get_short_name на уровне класса, чтобы он возвращал "Dr. Smith"
        patcher = patch('apps.staffing.models.Employee.get_short_name', return_value="Dr. Smith")
        self.addCleanup(patcher.stop)
        self.mock_get_short_name = patcher.start()

        # Определяем тестовые даты начала и окончания смены.
        self.start_time = datetime.datetime(2025, 3, 26, 8, 0)
        self.end_time = datetime.datetime(2025, 3, 26, 16, 0)

        # Создаем объект смены (Shift)
        self.shift = Shift.objects.create(
            doctor=self.employee,
            start_time=self.start_time,
            end_time=self.end_time,
            # Если в AbstractDocumentTemplate есть обязательные поля, их следует передать.
        )

    def test_serializer_fields(self):
        """Проверяем, что сериализатор корректно отображает все поля модели."""
        serializer = ShiftSerializer(instance=self.shift)
        data = serializer.data

        # Проверяем наличие основных полей
        self.assertIn('id', data)
        self.assertIn('doctor', data)
        self.assertIn('doctor_name', data)
        self.assertIn('start_time', data)
        self.assertIn('end_time', data)
        self.assertIn('shift_str', data)

        # Проверяем корректность значений
        self.assertEqual(data['doctor'], self.employee.pk)
        self.assertEqual(data['doctor_name'], "Dr. Smith")
        self.assertEqual(data['start_time'], "2025-03-26 08:00")
        self.assertEqual(data['end_time'], "2025-03-26 16:00")
        self.assertEqual(data['shift_str'], str(self.shift))

    def test_read_only_fields(self):
        """
        Проверяем, что read_only поля не могут быть изменены через сериализатор.
        При этом поля doctor_name и shift_str вычисляются через соответствующие методы.
        """
        update_data = {
            "doctor": self.employee.pk,
            "start_time": "2025-03-26 09:00",
            "end_time": "2025-03-26 17:00",
            "doctor_name": "Changed Name",
            "shift_str": "Changed Shift String",
        }
        serializer = ShiftSerializer(instance=self.shift, data=update_data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_shift = serializer.save()

        # Поля start_time и end_time должны обновиться
        self.assertEqual(updated_shift.start_time.strftime('%Y-%m-%d %H:%M'), "2025-03-26 09:00")
        self.assertEqual(updated_shift.end_time.strftime('%Y-%m-%d %H:%M'), "2025-03-26 17:00")

        # После обновления сериализатор вычисляет doctor_name и shift_str заново,
        # используя патченный метод get_short_name.
        serializer_after_update = ShiftSerializer(instance=updated_shift)
        self.assertEqual(serializer_after_update.data['doctor_name'], "Dr. Smith")
        self.assertEqual(serializer_after_update.data['shift_str'], str(updated_shift))
