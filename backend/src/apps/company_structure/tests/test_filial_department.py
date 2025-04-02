import re
from django.test import TestCase
from django.core.exceptions import ValidationError
from apps.company_structure.models import FilialDepartment
from apps.company_structure.models.filial import Filial
from apps.staffing.models import Employee, Position


class FilialDepartmentModelTest(TestCase):
    def setUp(self):
        # Создаем тестовый филиал
        self.filial = Filial.objects.create(
            city="Москва",
            street="Тверская",
            house="1"
        )

        # Создаем тестовую должность для сотрудника
        self.position = Position.objects.create(
            name="Руководитель отдела",
            short_name="Руководитель"
        )

        # Создаем тестового сотрудника (без привязки к подразделению)
        self.employee = Employee.objects.create(
            first_name="Иван",
            last_name="Иванов",
            patronymic="Иванович",
            gender="M",
            date_of_birth="1990-01-01",
            snils="111-222-333 44",
            inn="1234567890",
            photo=None,
            registration_address="Test address 1",
            actual_address="Test address 2",
            email="employee@test.com",
            phone="+7 111 222-33-44",
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

    def test_create_department_with_filial(self):
        """Тест создания подразделения с привязкой к филиалу"""
        department = FilialDepartment.objects.create(
            name="Отдел логистики",
            filial=self.filial
        )
        self.assertEqual(department.filial, self.filial)
        self.assertIn(department, self.filial.filialdepartment_set.all())


    def test_name_validation(self):
        """Тест валидации названия подразделения"""
        # Слишком короткое название
        dept = FilialDepartment(name="А")
        with self.assertRaises(ValidationError):
            dept.full_clean()

        # Недопустимые символы: разрешены только буквы, пробелы и дефисы
        dept = FilialDepartment(name="Отдел!@#")
        with self.assertRaises(ValidationError):
            dept.full_clean()

    def test_unique_name_per_filial(self):
        """Тест уникальности названия в рамках филиала"""
        # Создаем первую запись
        dept1 = FilialDepartment.objects.create(
            name="Бухгалтерия",
            filial=self.filial
        )
        # Попытка создать дубликат в том же филиале – создаём объект без сохранения
        dept2 = FilialDepartment(name="Бухгалтерия", filial=self.filial)
        with self.assertRaises(ValidationError):
            dept2.full_clean()
        # Создаем подразделение с тем же именем, но в другом филиале
        another_filial = Filial.objects.create(
            city="Санкт-Петербург",
            street="Невский",
            house="2"
        )
        dept3 = FilialDepartment.objects.create(
            name="Бухгалтерия",
            filial=another_filial
        )
        # В базе должны быть две записи: dept1 и dept3
        self.assertEqual(FilialDepartment.objects.count(), 2)

    def test_str_method(self):
        """Тест строкового представления"""
        department = FilialDepartment.objects.create(
            name="Отдел кадров"
        )
        self.assertEqual(str(department), "Отдел кадров")

    def test_filial_deletion(self):
        """Тест удаления связанного филиала"""
        department = FilialDepartment.objects.create(
            name="Склад",
            filial=self.filial
        )
        self.filial.delete()
        department.refresh_from_db()
        self.assertIsNone(department.filial)
