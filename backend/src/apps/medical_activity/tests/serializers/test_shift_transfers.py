import datetime
from django.test import TestCase
from unittest.mock import patch
from apps.medical_activity.models import ShiftTransfer
from apps.medical_activity.serializers import ShiftTransferSerializer
from apps.medical_activity.models.shifts import Shift
from apps.staffing.models import Employee


class ShiftTransferSerializerTestCase(TestCase):
    def setUp(self):
        # Создаем тестового сотрудника.
        self.employee = Employee.objects.create()
        # Патчим метод get_short_name на уровне класса, чтобы всегда возвращался "Dr. Smith"
        patcher = patch('apps.staffing.models.Employee.get_short_name', return_value="Dr. Smith")
        self.addCleanup(patcher.stop)
        self.mock_get_short_name = patcher.start()

        # Создаем две смены с разными временами
        self.shift1_start = datetime.datetime(2026, 3, 26, 8, 0)
        self.shift1_end = datetime.datetime(2026, 3, 26, 16, 0)
        self.shift1 = Shift.objects.create(
            doctor=self.employee,
            start_time=self.shift1_start,
            end_time=self.shift1_end,
            # При необходимости добавить обязательные поля, унаследованные от AbstractDocumentTemplate
        )

        self.shift2_start = datetime.datetime(2026, 3, 27, 8, 0)
        self.shift2_end = datetime.datetime(2026, 3, 27, 16, 0)
        self.shift2 = Shift.objects.create(
            doctor=self.employee,
            start_time=self.shift2_start,
            end_time=self.shift2_end,
        )

        # Создаем объект передачи смен (ShiftTransfer)
        self.transfer = ShiftTransfer.objects.create(
            from_shift=self.shift1,
            to_shift=self.shift2,
            comment="Initial comment"
        )

    def test_serializer_fields(self):
        """
        Проверяем, что сериализатор возвращает все ожидаемые поля с корректными значениями.
        """
        serializer = ShiftTransferSerializer(instance=self.transfer)
        data = serializer.data

        # Проверяем наличие всех необходимых полей
        self.assertIn('id', data)
        self.assertIn('from_shift', data)
        self.assertIn('from_shift_str', data)
        self.assertIn('to_shift', data)
        self.assertIn('to_shift_str', data)
        self.assertIn('date', data)
        self.assertIn('comment', data)
        self.assertIn('transfer_str', data)

        # Проверяем корректность значений основных полей
        self.assertEqual(data['from_shift'], self.shift1.pk)
        self.assertEqual(data['to_shift'], self.shift2.pk)
        self.assertEqual(data['from_shift_str'], str(self.shift1))
        self.assertEqual(data['to_shift_str'], str(self.shift2))
        self.assertEqual(data['transfer_str'], str(self.transfer))
        self.assertEqual(data['comment'], "Initial comment")

        # Проверяем, что поле date отформатировано по шаблону "YYYY-MM-DD HH:MM"
        try:
            datetime.datetime.strptime(data['date'], '%Y-%m-%d %H:%M')
        except ValueError:
            self.fail("Поле date не соответствует формату 'YYYY-MM-DD HH:MM'")

    def test_read_only_fields(self):
        """
        Проверяем, что read_only поля не могут быть изменены через сериализатор.
        Попытка обновления computed полей (from_shift_str, to_shift_str, transfer_str и date)
        должна быть проигнорирована.
        """
        update_data = {
            "from_shift_str": "Invalid",
            "to_shift_str": "Invalid",
            "transfer_str": "Invalid",
            "date": "2025-01-01 00:00",
            "comment": "Updated comment"
        }
        serializer = ShiftTransferSerializer(instance=self.transfer, data=update_data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_transfer = serializer.save()

        # Проверяем, что computed (read_only) поля пересчитываются и не равны переданным невалидным значениям
        serializer_after_update = ShiftTransferSerializer(instance=updated_transfer)
        data_after_update = serializer_after_update.data

        self.assertEqual(data_after_update['from_shift_str'], str(updated_transfer.from_shift))
        self.assertEqual(data_after_update['to_shift_str'], str(updated_transfer.to_shift))
        self.assertEqual(data_after_update['transfer_str'], str(updated_transfer))
        # Поле date должно быть сгенерировано автоматически, поэтому переданное значение игнорируется
        self.assertNotEqual(data_after_update['date'], "2025-01-01 00:00")
        # Проверяем, что обновилось поле comment
        self.assertEqual(data_after_update['comment'], "Updated comment")
