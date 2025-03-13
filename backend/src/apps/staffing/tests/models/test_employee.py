from datetime import timedelta
from django.test import TestCase
from apps.staffing.models import Employee, Position

class EmployeeModelTest(TestCase):
    def setUp(self):
        # Создаём запись в модели «Должность»
        self.position = Position.objects.create(
            name="Doctor",
            short_name="Dr",
            minzdrav_position=None  # или другая логика
        )
        # Создаём объект «Сотрудник»
        self.employee = Employee.objects.create(
            last_name="Doe",
            first_name="John",
            patronymic="Smith",  # если используется в абстрактной модели
            department="IT Department",
            position=self.position,
            appointment_duration=timedelta(minutes=30),
            short_description="Врач, ведущий приём пациентов."
        )

    def test_employee_created_successfully(self):
        """
        Проверяем, что объект «Сотрудник» корректно создался и сохранился в БД.
        """
        self.assertEqual(Employee.objects.count(), 1)
        employee = Employee.objects.first()
        self.assertEqual(employee.last_name, "Doe")
        self.assertEqual(employee.first_name, "John")
        self.assertEqual(employee.department, "IT Department")
        self.assertEqual(employee.position, self.position)
        self.assertEqual(employee.appointment_duration, timedelta(minutes=30))
        self.assertEqual(employee.short_description, "Врач, ведущий приём пациентов.")

    def test_str_method(self):
        """
        Проверяем, что метод __str__ возвращает корректное представление сотрудника.
        """
        expected_str = "Сотрудник Doe John Smith"
        self.assertEqual(str(self.employee), expected_str)

    def test_get_full_name(self):
        """
        Если в абстрактной модели определён метод get_full_name,
        проверяем корректность формирования ФИО.
        """
        expected_full_name = "Doe John Smith"
        self.assertEqual(self.employee.get_full_name(), expected_full_name)
