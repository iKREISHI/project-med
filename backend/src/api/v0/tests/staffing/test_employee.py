from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from apps.staffing.models import Employee
import uuid


class EmployeeViewSetTests(APITestCase):
    def setUp(self):
        self.user_model = get_user_model()
        # Убедимся, что необходимые permissions для модели Employee существуют.
        ct = ContentType.objects.get_for_model(Employee)
        Permission.objects.get_or_create(
            codename='view_employee',
            defaults={'name': 'Can view Employee', 'content_type': ct}
        )
        Permission.objects.get_or_create(
            codename='add_employee',
            defaults={'name': 'Can add Employee', 'content_type': ct}
        )
        Permission.objects.get_or_create(
            codename='change_employee',
            defaults={'name': 'Can change Employee', 'content_type': ct}
        )
        Permission.objects.get_or_create(
            codename='delete_employee',
            defaults={'name': 'Can delete Employee', 'content_type': ct}
        )

        # Создаем тестового сотрудника, используя только поля, определенные в модели.
        self.employee = Employee.objects.create(
            last_name="Testov",
            first_name="Test",
            patronymic="Testovich",
            gender="M",
            date_of_birth="1990-01-01",
            snils="111-222-333 44",
            inn="1234567890",
            photo=None,  # Фото установлено в null
            registration_address="Test address 1",
            actual_address="Test address 2",
            email="employee@test.com",
            phone="+7 111 222-33-44",
            uuid=uuid.uuid4()  # Если поле uuid не генерируется автоматически
        )
        # Используем reverse для получения URL-адресов из router
        self.list_url = reverse('employee-list')
        self.detail_url = reverse('employee-detail', kwargs={'uuid': str(self.employee.uuid)})

    def create_user_with_perms(self, perms):
        """
        Создает тестового пользователя и назначает ему указанные permissions.
        Примеры: 'view_employee', 'add_employee', 'change_employee', 'delete_employee'
        """
        user = self.user_model.objects.create_user(username='testuser', password='password')
        for perm in perms:
            permission = Permission.objects.get(codename=perm)
            user.user_permissions.add(permission)
        user.save()
        return user

    def test_list_without_view_permission(self):
        """Проверяем, что пользователь без permission 'view_employee' получает список сотрудников.
           (Поведение разрешает GET-запросы даже без явного права просмотра.)"""
        user = self.create_user_with_perms([])
        self.client.force_authenticate(user=user)
        response = self.client.get(self.list_url)
        # Ожидаем 200, так как GET-запросы разрешены для аутентифицированных пользователей
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_with_view_permission(self):
        """Проверяем, что пользователь с permission 'view_employee' может получить список сотрудников."""
        user = self.create_user_with_perms(['view_employee'])
        self.client.force_authenticate(user=user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_without_view_permission(self):
        """Проверяем, что без permission 'view_employee' можно получить детали сотрудника.
           (Поведение разрешает GET-запросы даже без явного права просмотра.)"""
        user = self.create_user_with_perms([])
        self.client.force_authenticate(user=user)
        response = self.client.get(self.detail_url)
        # Ожидаем 200, так как GET-запросы разрешены для аутентифицированных пользователей
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_with_view_permission(self):
        """Проверяем, что с permission 'view_employee' можно получить детали сотрудника."""
        user = self.create_user_with_perms(['view_employee'])
        self.client.force_authenticate(user=user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_without_add_permission(self):
        """Проверяем, что без permission 'add_employee' создание сотрудника недоступно."""
        user = self.create_user_with_perms([])
        self.client.force_authenticate(user=user)
        data = {
            "last_name": "Newov",
            "first_name": "New",
            "patronymic": "Newovich",
            "gender": "M",
            "date_of_birth": "1992-02-02",
            "snils": "222-333-444 55",
            "inn": "0987654321",
            "photo": None,  # Фото установлено в null
            "registration_address": "New Address 1",
            "actual_address": "New Address 2",
            "email": "new.employee@test.com",
            "phone": "+7 222 333-44-55",
            "user": None  # Явно указываем, что пользователь отсутствует
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_with_add_permission(self):
        """Проверяем, что с permission 'add_employee' можно создать сотрудника."""
        user = self.create_user_with_perms(['add_employee'])
        self.client.force_authenticate(user=user)
        data = {
            "last_name": "Newov",
            "first_name": "New",
            "patronymic": "Newovich",
            "gender": "M",
            "date_of_birth": "1992-02-02",
            "snils": "222-333-444 55",
            "inn": "0987654321",
            "photo": None,  # Фото установлено в null
            "registration_address": "New Address 1",
            "actual_address": "New Address 2",
            "email": "new.employee@test.com",
            "phone": "+72223334455",
            "user": None  # Явно указываем, что пользователь отсутствует
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_without_change_permission(self):
        """Проверяем, что без permission 'change_employee' обновление сотрудника недоступно."""
        user = self.create_user_with_perms(['view_employee'])
        self.client.force_authenticate(user=user)
        data = {
            "last_name": self.employee.last_name,
            "first_name": self.employee.first_name,
            "patronymic": self.employee.patronymic,
            "gender": self.employee.gender,
            "date_of_birth": self.employee.date_of_birth,
            "snils": self.employee.snils,
            "inn": self.employee.inn,
            "photo": None,  # Фото установлено в null
            "registration_address": self.employee.registration_address,
            "actual_address": self.employee.actual_address,
            "email": self.employee.email,
            "phone": self.employee.phone,
            "user": None  # Явно указываем, что пользователь отсутствует
        }
        response = self.client.put(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_with_change_permission(self):
        """Проверяем, что с permission 'change_employee' можно обновить данные сотрудника."""
        user = self.create_user_with_perms(['change_employee', 'view_employee'])
        self.client.force_authenticate(user=user)
        data = {
            "last_name": "UpdatedLastName",  # Изменяем фамилию для проверки обновления
            "first_name": self.employee.first_name,
            "patronymic": self.employee.patronymic,
            "gender": self.employee.gender,
            "date_of_birth": self.employee.date_of_birth,
            "snils": self.employee.snils,
            "inn": self.employee.inn,
            "photo": None,  # Фото установлено в null
            "registration_address": self.employee.registration_address,
            "actual_address": self.employee.actual_address,
            "email": self.employee.email,
            "phone": None,
            "user": None  # Явно указываем, что пользователь отсутствует
        }
        response = self.client.put(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_destroy_without_delete_permission(self):
        """Проверяем, что без permission 'delete_employee' удаление сотрудника недоступно."""
        user = self.create_user_with_perms(['view_employee'])
        self.client.force_authenticate(user=user)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_destroy_with_delete_permission(self):
        """Проверяем, что с permission 'delete_employee' можно удалить сотрудника."""
        user = self.create_user_with_perms(['delete_employee', 'view_employee'])
        self.client.force_authenticate(user=user)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
