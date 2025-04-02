import datetime
from django.test import TestCase
from unittest.mock import patch
from apps.medical_activity.models import PatientCondition
from apps.medical_activity.serializers import PatientConditionSerializer
from apps.medical_activity.models.shifts import Shift
from apps.staffing.models import Employee
from apps.clients.models import Patient


class PatientConditionSerializerTestCase(TestCase):
    def setUp(self):
        # Создаем тестового пациента и переопределяем его метод get_short_name напрямую
        self.patient = Patient.objects.create()
        self.patient.get_short_name = lambda: "John Doe"

        # Создаем тестового сотрудника и патчим его метод get_short_name
        self.employee = Employee.objects.create()
        patcher = patch('apps.staffing.models.Employee.get_short_name', return_value="Dr. Smith")
        self.addCleanup(patcher.stop)
        self.mock_employee_get_short_name = patcher.start()

        # Создаем тестовую смену
        self.shift_start = datetime.datetime(2026, 3, 26, 8, 0)
        self.shift_end = datetime.datetime(2026, 3, 26, 16, 0)
        self.shift = Shift.objects.create(
            doctor=self.employee,
            start_time=self.shift_start,
            end_time=self.shift_end,
            # Если в AbstractDocumentTemplate есть обязательные поля, их нужно указать
        )

        # Создаем объект состояния пациента
        self.patient_condition = PatientCondition.objects.create(
            patient=self.patient,
            shift=self.shift,
            description="Initial condition description",
            status="Stable"  # Один из вариантов из STATUS_CHOICES
        )

    def test_serializer_fields(self):
        """
        Проверяем, что сериализатор возвращает все ожидаемые поля с корректными значениями.
        """
        serializer = PatientConditionSerializer(instance=self.patient_condition)
        data = serializer.data

        # Проверяем наличие всех необходимых полей
        self.assertIn('id', data)
        self.assertIn('patient', data)
        self.assertIn('patient_name', data)
        self.assertIn('shift', data)
        self.assertIn('shift_str', data)
        self.assertIn('description', data)
        self.assertIn('date', data)
        self.assertIn('status', data)
        self.assertIn('condition_str', data)

        # Проверяем корректность значений
        self.assertEqual(data['patient'], self.patient.pk)
        self.assertEqual(data['patient_name'], "John Doe")
        self.assertEqual(data['shift'], self.shift.pk)
        self.assertEqual(data['shift_str'], str(self.shift))
        self.assertEqual(data['description'], "Initial condition description")
        self.assertEqual(data['status'], "Stable")

        # Проверяем, что поле date отформатировано согласно шаблону "YYYY-MM-DD HH:MM"
        try:
            datetime.datetime.strptime(data['date'], '%Y-%m-%d %H:%M')
        except ValueError:
            self.fail("Поле date не соответствует формату 'YYYY-MM-DD HH:MM'")

        # Проверяем вычисляемое строковое представление состояния
        expected_condition_str = f"John Doe - Stable - {data['date']}"
        self.assertEqual(data['condition_str'], expected_condition_str)

    def test_read_only_fields(self):
        """
        Проверяем, что read_only поля не могут быть изменены через сериализатор.
        Попытка обновления computed полей (patient_name, shift_str, date, condition_str)
        должна быть проигнорирована.
        """
        update_data = {
            'patient_name': "Changed Name",
            'shift_str': "Changed Shift",
            'date': "2025-01-01 00:00",
            'condition_str': "Changed Condition String",
            'description': "Updated description",
            'status': "Worsening"
        }
        serializer = PatientConditionSerializer(instance=self.patient_condition, data=update_data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_condition = serializer.save()

        serializer_after_update = PatientConditionSerializer(instance=updated_condition)
        data_after_update = serializer_after_update.data

        # Проверяем, что вычисляемые поля пересчитаны и не равны переданным невалидным значениям
        self.assertEqual(data_after_update['patient_name'], "John Doe")
        self.assertEqual(data_after_update['shift_str'], str(updated_condition.shift))
        expected_condition_str = f"John Doe - {updated_condition.status} - {data_after_update['date']}"
        self.assertEqual(data_after_update['condition_str'], expected_condition_str)
        self.assertNotEqual(data_after_update['date'], "2025-01-01 00:00")

        # Проверяем, что изменились только разрешённые для записи поля
        self.assertEqual(data_after_update['description'], "Updated description")
        self.assertEqual(data_after_update['status'], "Worsening")
