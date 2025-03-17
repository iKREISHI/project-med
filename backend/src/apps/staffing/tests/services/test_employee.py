import datetime
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from apps.staffing.models import Employee, Position
from apps.staffing.services import EmployeeService  # Предполагается, что сервис находится в apps/staffing/services.py

User = get_user_model()


class EmployeeServiceTestCase(TestCase):
    def setUp(self):
        # Создаем тестового пользователя.
        self.user = User.objects.create_user(username='employee_test', password='testpassword')

        # Создаем тестовую должность.
        self.position, _ = Position.objects.get_or_create(
            name="Test Position",
            defaults={
                "short_name": "TestPos",
                "minzdrav_position": "TestPosMin"
            }
        )

        # Определяем корректный набор данных для создания сотрудника.
        self.valid_data = {
            'user': self.user,
            'last_name': 'Ivanov',
            'first_name': 'Ivan',
            'patronymic': 'Ivanovich',
            'gender': 'M',
            'date_of_birth': datetime.date(1990, 1, 1),
            'snils': '123-456-789 00',
            'inn': '1234567890',
            # Поле photo оставляем пустым
            'registration_address': 'ул. Ленина, д. 1',
            'actual_address': 'ул. Пушкина, д. 5',
            'email': 'employee@example.com',
            'phone': '+1234567890',
            'department': None,  # Допустим, отдел не указан
            'position': self.position,
            'appointment_duration': None,  # Если не требуется, можно оставить None
            'short_description': 'Тестовый сотрудник'
        }

    def test_create_employee_valid(self):
        """Проверяет создание сотрудника с корректными данными."""
        employee = EmployeeService.create_employee(**self.valid_data)
        self.assertIsNotNone(employee.pk)
        self.assertEqual(employee.first_name, self.valid_data['first_name'])
        self.assertEqual(employee.last_name, self.valid_data['last_name'])
        self.assertEqual(employee.user, self.user)
        self.assertEqual(employee.position, self.position)

    def test_create_employee_invalid(self):
        """Проверяет, что при неверных данных (например, пустая фамилия) выбрасывается ValidationError."""
        invalid_data = self.valid_data.copy()
        invalid_data['last_name'] = ""  # Предполагается, что валидатор не принимает пустую фамилию.
        with self.assertRaises(ValidationError):
            EmployeeService.create_employee(**invalid_data)

    def test_update_employee_valid(self):
        """Проверяет корректное обновление данных сотрудника."""
        employee = EmployeeService.create_employee(**self.valid_data)
        new_data = {
            'first_name': 'Petr',
            'last_name': 'Petrov',
            'short_description': 'Обновленный сотрудник'
        }
        updated_employee = EmployeeService.update_employee(employee, **new_data)
        self.assertEqual(updated_employee.first_name, 'Petr')
        self.assertEqual(updated_employee.last_name, 'Petrov')
        self.assertEqual(updated_employee.short_description, 'Обновленный сотрудник')

    def test_update_employee_invalid_field(self):
        """Проверяет, что попытка обновить несуществующее поле приводит к ValueError."""
        employee = EmployeeService.create_employee(**self.valid_data)
        with self.assertRaises(ValueError) as context:
            EmployeeService.update_employee(employee, non_existent_field='value')
        self.assertIn("Сотрудник не имеет поля", str(context.exception))

    def test_get_employee_by_uuid(self):
        """Проверяет получение сотрудника по UUID."""
        employee = EmployeeService.create_employee(**self.valid_data)
        retrieved = EmployeeService.get_employee_by_uuid(str(employee.uuid))
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved.pk, employee.pk)

    def test_delete_employee(self):
        """Проверяет удаление сотрудника."""
        employee = EmployeeService.create_employee(**self.valid_data)
        pk = employee.pk
        EmployeeService.delete_employee(employee)
        self.assertIsNone(Employee.objects.filter(pk=pk).first())
