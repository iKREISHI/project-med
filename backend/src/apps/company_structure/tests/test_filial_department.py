from django.test import TestCase
from django.core.exceptions import ValidationError

from apps.company_structure.models import FilialDepartment
from apps.company_structure.models.model.filial import Filial
from apps.staffing.models import Employee, Position


class FilialDepartmentModelTest(TestCase):
    def setUp(self):
        # Создаем тестовые данные
        self.filial = Filial.objects.create(
            city="Москва",
            street="Тверская",
            house="1"
        )

        self.position = Position.objects.create(
            name="Руководитель отдела",
            short_name="Руководитель"
        )

        self.employee = Employee.objects.create(
            first_name="Иван",
            last_name="Иванов",
            position=self.position
        )

    def test_create_department_basic(self):
        """Тест создания подразделения с минимальными данными"""
        department = FilialDepartment.objects.create(
            name="Отдел продаж"
        )
        self.assertEqual(FilialDepartment.objects.count(), 1)
        self.assertEqual(department.name, "Отдел продаж")
        self.assertIsNone(department.filial)
        self.assertIsNone(department.director)

    def test_create_department_with_filial(self):
        """Тест создания подразделения с привязкой к филиалу"""
        department = FilialDepartment.objects.create(
            name="Отдел логистики",
            filial=self.filial
        )
        self.assertEqual(department.filial, self.filial)
        self.assertIn(department, self.filial.filialdepartment_set.all())

    def test_director_assignment(self):
        """Тест назначения руководителя подразделения"""
        department = FilialDepartment.objects.create(
            name="IT-отдел",
            filial=self.filial,
            director=self.employee
        )

        # Проверяем связь
        self.assertEqual(department.director, self.employee)
        self.assertIn(department, self.employee.managed_departments.all())

        # Проверяем каскадное удаление
        self.employee.delete()
        department.refresh_from_db()
        self.assertIsNone(department.director)

    def test_name_validation(self):
        """Тест валидации названия подразделения"""
        # Слишком короткое название
        with self.assertRaises(ValidationError):
            FilialDepartment.objects.create(name="А").full_clean()

        # Недопустимые символы
        with self.assertRaises(ValidationError):
            FilialDepartment.objects.create(name="Отдел!@#").full_clean()

    def test_unique_name_per_filial(self):
        """Тест уникальности названия в рамках филиала"""
        FilialDepartment.objects.create(
            name="Бухгалтерия",
            filial=self.filial
        )

        # Дубликат в том же филиале
        with self.assertRaises(ValidationError):
            FilialDepartment.objects.create(
                name="Бухгалтерия",
                filial=self.filial
            ).full_clean()

        # Разные филиалы
        another_filial = Filial.objects.create(
            city="Санкт-Петербург",
            street="Невский",
            house="2"
        )
        FilialDepartment.objects.create(
            name="Бухгалтерия",
            filial=another_filial
        )
        self.assertEqual(FilialDepartment.objects.count(), 2)

    def test_string_representation(self):
        """Тест строкового представления"""
        department = FilialDepartment.objects.create(
            name="Отдел кадров"
        )
        self.assertEqual(str(department), "Отдел кадров")

    def test_director_department_consistency(self):
        """Тест согласованности подразделения директора"""
        department = FilialDepartment.objects.create(
            name="Отдел разработки",
            filial=self.filial
        )

        # Сотрудник не из этого подразделения
        with self.assertRaises(ValidationError):
            department.director = self.employee
            department.full_clean()

        # Назначаем сотрудника в подразделение
        self.employee.department = department
        self.employee.save()
        department.director = self.employee
        department.full_clean()  # Не должно быть ошибки

    def test_filial_deletion(self):
        """Тест удаления связанного филиала"""
        department = FilialDepartment.objects.create(
            name="Склад",
            filial=self.filial
        )
        self.filial.delete()
        department.refresh_from_db()
        self.assertIsNone(department.filial)