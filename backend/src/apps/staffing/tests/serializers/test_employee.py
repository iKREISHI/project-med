from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from apps.staffing.models import Employee, Position
from apps.staffing.serializers.employee import EmployeeSerializer
from apps.staffing.services import EmployeeService
import datetime

User = get_user_model()


class EmployeeSerializerTestCase(TestCase):
    def setUp(self):
        # Создаем тестового пользователя
        self.user = User.objects.create_user(username='employee_user', password='testpassword')

        # Создаем тестовую должность (Position)
        self.position, _ = Position.objects.get_or_create(
            name="Test Position",
            defaults={
                "short_name": "TestPos",
                "minzdrav_position": "TestMinPos"
            }
        )

        # Формируем корректный набор данных для создания сотрудника.
        # Заметьте, что для полей-связей (user и position) мы передаем их первичные ключи,
        # поскольку ModelSerializer по умолчанию использует PrimaryKeyRelatedField.
        self.valid_data = {
            "user": self.user.pk,
            "last_name": "Ivanov",
            "first_name": "Ivan",
            "patronymic": "Ivanovich",
            "gender": "M",
            "date_of_birth": "1990-01-01",
            "snils": "123-456-789 00",
            "inn": "1234567890",
            # Поле photo можно опустить, если оно не требуется для теста.
            "registration_address": "ул. Ленина, д. 1",
            "actual_address": "ул. Пушкина, д. 5",
            "email": "employee@example.com",
            "phone": "+1234567890",
            "department": None,  # Если отдел не указан
            "position": self.position.pk,
            "appointment_duration": None,  # Если не требуется
            "short_description": "Test employee"
        }

    def test_create_employee_valid(self):
        """Проверка создания сотрудника с валидными данными."""
        serializer = EmployeeSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        employee = serializer.save()
        self.assertIsNotNone(employee.pk)
        self.assertEqual(employee.first_name, self.valid_data["first_name"])
        self.assertEqual(employee.last_name, self.valid_data["last_name"])
        self.assertEqual(employee.short_description, self.valid_data["short_description"])
        # Проверяем, что связи корректно установлены
        self.assertEqual(employee.user.pk, self.user.pk)
        self.assertEqual(employee.position.pk, self.position.pk)

    def test_unknown_field_error(self):
        """Проверка ошибки валидации при наличии неизвестного поля."""
        data = self.valid_data.copy()
        data["unknown_field"] = "unexpected value"
        serializer = EmployeeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("unknown_field", serializer.errors)
        self.assertEqual(serializer.errors["unknown_field"][0], "This field is not allowed.")

    def test_short_description_must_be_string(self):
        """Проверка ошибки, если short_description передан не в виде строки."""
        data = self.valid_data.copy()
        data["short_description"] = 12345  # не строка
        serializer = EmployeeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("short_description", serializer.errors)
        self.assertEqual(serializer.errors["short_description"][0], "This field must be a string.")

    def test_update_employee_valid(self):
        """Проверка корректного частичного обновления сотрудника."""
        # Создаем сотрудника
        serializer = EmployeeSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        employee = serializer.save()

        update_data = {
            "first_name": "Petr",
            "last_name": "Petrov",
            "short_description": "Updated employee description"
        }
        serializer_update = EmployeeSerializer(instance=employee, data=update_data, partial=True)
        self.assertTrue(serializer_update.is_valid(), serializer_update.errors)
        updated_employee = serializer_update.save()
        self.assertEqual(updated_employee.first_name, "Petr")
        self.assertEqual(updated_employee.last_name, "Petrov")
        self.assertEqual(updated_employee.short_description, "Updated employee description")

    def test_update_employee_unknown_field(self):
        """Проверка, что попытка обновления с неизвестным полем вызывает ошибку валидации."""
        serializer = EmployeeSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        employee = serializer.save()

        update_data = {"nonexistent": "value"}
        serializer_update = EmployeeSerializer(instance=employee, data=update_data, partial=True)
        self.assertFalse(serializer_update.is_valid())
        self.assertIn("nonexistent", serializer_update.errors)
        self.assertEqual(serializer_update.errors["nonexistent"][0], "This field is not allowed.")
