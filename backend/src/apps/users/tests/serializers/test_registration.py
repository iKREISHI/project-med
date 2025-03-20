from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from apps.staffing.models import Employee, Position
from apps.company_structure.models import FilialDepartment
from apps.users.serializers.registration import RegistrationModelSerializer, generate_username_by_fio
from apps.users.services.generate_username_by_fio import generate_username_by_fio as original_generate_username_by_fio

User = get_user_model()

def fake_generate_username_by_fio(first_name, last_name, patronymic):
    # Возвращает не пустое значение, основанное на ФИО
    return f"{last_name.lower()}_{first_name.lower()}_{patronymic.lower()}" if patronymic else f"{last_name.lower()}_{first_name.lower()}"

class RegistrationModelSerializerTestCase(TestCase):
    def setUp(self):
        # Подменяем функцию генерации username
        self._original_generate_username = generate_username_by_fio
        from apps.users import serializers  # Импортируем модуль, где используется функция
        serializers.registration.generate_username_by_fio = fake_generate_username_by_fio

        # Создаем необходимые объекты для валидации department и position
        self.department = FilialDepartment.objects.create(name="Отдел продаж")
        self.position = Position.objects.create(name="Менеджер", short_name="Менеджер")

        self.valid_data = {
            "first_name": "Иван",
            "last_name": "Иванов",
            "patronymic": "Иванович",
            "is_django_user": True,
            "gender": "M",
            "date_of_birth": "2000-01-01",
            "snils": "123-456-789 00",
            "inn": "1234567890",
            "registration_address": "г. Москва, ул. Ленина, д. 1",
            "actual_address": "г. Москва, ул. Пушкина, д. 2",
            "email": "ivanov@example.com",
            "phone": "+79261234567",
            "department": self.department.id,  # pk
            "position": self.position.id,        # pk
            "short_description": "Тестовый сотрудник"
        }

    def tearDown(self):
        from apps.users import serializers
        serializers.registration.generate_username_by_fio = self._original_generate_username

    def test_valid_registration(self):
        """Проверяет успешную регистрацию сотрудника при корректных данных."""
        serializer = RegistrationModelSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        employee = serializer.save()
        self.assertIsNotNone(employee)
        rep = serializer.to_representation(employee)
        self.assertIn("user", rep)
        self.assertIn("username", rep["user"])
        self.assertIn("password", rep["user"])
        self.assertNotEqual(rep["user"]["username"], "")
        self.assertTrue(User.objects.filter(username=rep["user"]["username"]).exists())

    def test_existing_employee_without_identifiers(self):
        """
        Проверяет, что при попытке зарегистрировать сотрудника с таким же ФИО
        без указания СНИЛС и ИНН выбрасывается ошибка.
        """
        serializer = RegistrationModelSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        serializer.save()

        data = self.valid_data.copy()
        data["snils"] = ""
        data["inn"] = ""
        serializer2 = RegistrationModelSerializer(data=data)
        self.assertFalse(serializer2.is_valid())
        # Ожидаем ошибку в non_field_errors
        self.assertIn("non_field_errors", serializer2.errors)
        # Ожидаем, что сообщение содержит "Пользователь с таким ФИО уже существует"
        self.assertIn("Пользователь с таким ФИО уже существует", serializer2.errors["non_field_errors"][0])

    def test_existing_employee_with_same_identifiers(self):
        """
        Проверяет, что при регистрации сотрудника с таким же ФИО, ИНН и СНИЛС
        выбрасывается ошибка.
        """
        serializer = RegistrationModelSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        serializer.save()

        serializer2 = RegistrationModelSerializer(data=self.valid_data)
        self.assertFalse(serializer2.is_valid())
        self.assertIn("non_field_errors", serializer2.errors)
        # Ожидаем сообщение о дублировании СНИЛС (с учетом порядка проверок)
        self.assertIn("Данный СНИЛС уже используется", serializer2.errors["non_field_errors"][0])

    def test_existing_user_generated_username(self):
        """
        Проверяет, что если пользователь с сгенерированным именем уже существует,
        регистрация не проходит.
        """
        username = fake_generate_username_by_fio(
            self.valid_data["first_name"],
            self.valid_data["last_name"],
            self.valid_data["patronymic"]
        )
        User.objects.create_user(username=username, password="secret")
        serializer = RegistrationModelSerializer(data=self.valid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("non_field_errors", serializer.errors)
        self.assertIn("Пользователь с таким именем уже существует", serializer.errors["non_field_errors"][0])

    def test_no_department_error(self):
        """
        Проверяет, что если в данных указан department, но ни одного FilialDepartment не существует,
        выбрасывается ошибка.
        """
        FilialDepartment.objects.all().delete()
        data = self.valid_data.copy()
        serializer = RegistrationModelSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        # Ошибка для department ожидается в поле department, поскольку передается pk, которого нет
        self.assertIn("department", serializer.errors)
        self.assertIn("Недопустимый первичный ключ", str(serializer.errors["department"]))

    def test_no_position_error(self):
        """
        Проверяет, что если в данных указан position, но ни одной должности не существует,
        выбрасывается ошибка.
        """
        Position.objects.all().delete()
        data = self.valid_data.copy()
        serializer = RegistrationModelSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("position", serializer.errors)
        self.assertIn("Недопустимый первичный ключ", str(serializer.errors["position"]))
