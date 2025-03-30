from datetime import timedelta
from django.test import TestCase
from apps.staffing.models import Employee, Position
from apps.company_structure.models import FilialDepartment


class EmployeeModelTest(TestCase):
    def setUp(self):
        # Создаём запись в модели «Должность»
        self.position = Position.objects.create(
            name="Doctor",
            short_name="Dr",
            minzdrav_position=None  # либо другое значение, если требуется
        )
        # Создаём запись для FilialDepartment
        self.department = FilialDepartment.objects.create(
            name="IT Department"
        )
        # Создаём объект «Сотрудник»
        self.employee = Employee.objects.create(
            last_name="Doe",
            first_name="John",
            patronymic="Smith",  # если используется в абстрактной модели
            department=self.department,  # передаём объект FilialDepartment
            position=self.position,
            appointment_duration=timedelta(minutes=30),
            short_description="Врач, ведущий приём пациентов."
        )

    def test_employee_created_successfully(self):
        """
        Проверяем, что объект «Сотрудник» корректно создается и сохраняется в базе данных.
        """
        self.assertEqual(Employee.objects.count(), 1)
        employee = Employee.objects.first()
        self.assertEqual(employee.last_name, "Doe")
        self.assertEqual(employee.first_name, "John")
        # Проверяем, что department – это экземпляр FilialDepartment и имеет корректное имя
        self.assertEqual(employee.department, self.department)
        self.assertEqual(employee.department.name, "IT Department")
        self.assertEqual(employee.position, self.position)
        self.assertEqual(employee.appointment_duration, timedelta(minutes=30))
        self.assertEqual(employee.short_description, "Врач, ведущий приём пациентов.")

    def test_str_method(self):
        """
        Проверяем, что метод __str__ возвращает корректное строковое представление сотрудника.
        """
        expected_str = f"Сотрудник {self.employee.get_full_name()}"
        self.assertEqual(str(self.employee), expected_str)

    def test_get_full_name(self):
        """
        Проверяем, что метод get_full_name корректно формирует ФИО сотрудника.
        """
        expected_full_name = "Doe John Smith"
        self.assertEqual(self.employee.get_full_name(), expected_full_name)
