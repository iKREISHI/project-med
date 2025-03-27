from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from apps.users.serializers.registration import generate_username_by_fio
from apps.company_structure.models import FilialDepartment
from apps.staffing.models import Position
from apps.users.models.users import User  # Или через get_user_model()

# Функция-замена для generate_username_by_fio, которая гарантированно возвращает непустое значение.
def fake_generate_username_by_fio(first_name, last_name, patronymic):
    if patronymic:
        return f"{last_name.lower()}_{first_name.lower()}_{patronymic.lower()}"
    return f"{last_name.lower()}_{first_name.lower()}"

class RegistrationViewSetTest(APITestCase):
    def setUp(self):
        # Подменяем функцию генерации username, чтобы она всегда возвращала валидное имя
        from apps.users import serializers
        self.original_generate_username = serializers.registration.generate_username_by_fio
        serializers.registration.generate_username_by_fio = fake_generate_username_by_fio

        # Создаем необходимые объекты для валидации department и position
        self.department = FilialDepartment.objects.create(name="Отдел продаж")
        self.position = Position.objects.create(name="Менеджер", short_name="Менеджер")

        # Формируем корректный набор данных для регистрации сотрудника.
        # Для полей-связей (department и position) передаются первичные ключи.
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
            "department": self.department.id,
            "position": self.position.id,
            "short_description": "Тестовый сотрудник"
        }
        # Registration endpoint URL, зарегистрированный через роутер с basename 'register-new-employee'
        self.url = reverse('register-new-employee-list')
        # Только администратор имеет доступ к этому API
        self.admin_user = get_user_model().objects.create_superuser(username="admin", password="adminpass")
        self.client.force_authenticate(user=self.admin_user)

    def tearDown(self):
        # Восстанавливаем оригинальную функцию генерации username
        from apps.users import serializers
        serializers.registration.generate_username_by_fio = self.original_generate_username

    def test_successful_registration(self):
        """
        Проверяет успешную регистрацию сотрудника при корректных данных.
        Ожидается, что в ответе будут сгенерированы данные пользователя (username и password)
        и что пользователь с таким именем существует в базе.
        """
        response = self.client.post(self.url, self.valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("user", response.data)
        self.assertIn("username", response.data["user"])
        self.assertIn("password", response.data["user"])
        username = response.data["user"]["username"]
        self.assertTrue(username)
        self.assertTrue(get_user_model().objects.filter(username=username).exists())

    def test_registration_invalid_data(self):
        """
        Проверяет, что при отсутствии обязательного поля (например, first_name)
        регистрация не проходит и возвращается ошибка 400.
        """
        invalid_data = self.valid_data.copy()
        del invalid_data["first_name"]
        response = self.client.post(self.url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("first_name", response.data)

    def test_non_admin_access(self):
        """
        Проверяет, что неадминистратор не имеет доступа к endpoint регистрации.
        При попытке отправить запрос обычным пользователем должен возвращаться статус 403.
        """
        normal_user = get_user_model().objects.create_user(username="user", password="userpass")
        self.client.force_authenticate(user=normal_user)
        response = self.client.post(self.url, self.valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
