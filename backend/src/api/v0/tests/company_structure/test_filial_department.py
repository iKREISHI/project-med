from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from apps.company_structure.models.filial import Filial
from apps.company_structure.models.filial_department import FilialDepartment

User = get_user_model()


class FilialDepartmentViewSetTestCase(APITestCase):
    def setUp(self):
        # Создаем суперпользователя для доступа (через DjangoModelPermissions)
        self.admin_user = User.objects.create_superuser(username='admin', password='adminpass')
        self.client.force_authenticate(user=self.admin_user)

        # Создаем тестовый филиал, который будем использовать для подразделений
        self.filial = Filial.objects.create(
            house="1",
            street="Main Street",
            city="TestCity"
        )

        # Данные для создания подразделения через API: для поля filial передаем pk
        self.valid_api_data = {
            "name": "Отдел продаж",
            "filial": self.filial.id
        }

        # Данные для создания подразделения через ORM: для поля filial передаем объект Filial
        self.valid_model_data = {
            "name": "Отдел продаж",
            "filial": self.filial
        }

        # Данные без поля filial (поле обязательно)
        self.invalid_data_without_filial = {
            "name": "Отдел маркетинга"
        }

        # URL для list endpoint, предполагается, что ViewSet зарегистрирован с basename 'filialdepartment'
        self.list_url = reverse('filialdepartment-list')

    def test_list_filial_departments(self):
        """Проверяем, что list endpoint возвращает все подразделения.
        Если пагинация включена, ответ должен быть словарем с ключами 'count', 'results' и т.д.
        Если пагинация не применяется, ответ может быть списком."""
        # Создаем два подразделения
        FilialDepartment.objects.create(name="Отдел продаж", filial=self.filial)
        FilialDepartment.objects.create(name="Отдел маркетинга", filial=self.filial)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        if isinstance(data, dict):
            # Пагинированный ответ
            self.assertIn("count", data)
            self.assertIn("results", data)
            self.assertEqual(data["count"], 2)
            self.assertEqual(len(data["results"]), 2)
            names = [item["name"] for item in data["results"]]
        else:
            # Ответ без пагинации – список
            self.assertIsInstance(data, list)
            self.assertEqual(len(data), 2)
            names = [item["name"] for item in data]
        self.assertIn("Отдел продаж", names)
        self.assertIn("Отдел маркетинга", names)

    def test_retrieve_filial_department(self):
        """Проверяем получение подразделения по id."""
        department = FilialDepartment.objects.create(**self.valid_model_data)
        # Используем ключ 'id' для формирования URL, т.к. lookup_field = 'id'
        detail_url = reverse('filialdepartment-detail', kwargs={'id': department.id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Отдел продаж")
        # Проверяем, что поле filial возвращает pk равный self.filial.id
        self.assertEqual(response.data["filial"], self.filial.id)

    def test_create_filial_department(self):
        """Проверяем создание подразделения через POST с корректными данными."""
        response = self.client.post(self.list_url, self.valid_api_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], self.valid_api_data["name"])
        self.assertEqual(response.data["filial"], self.filial.id)
        # Проверяем, что подразделение создано в базе
        self.assertTrue(FilialDepartment.objects.filter(name="Отдел продаж").exists())

    def test_invalid_filial_department_without_filial(self):
        """Проверяем, что сериализатор не проходит валидацию, если поле filial отсутствует."""
        serializer = self.client.post(self.list_url, self.invalid_data_without_filial, format="json")
        # Т.к. мы отправляем POST через клиент, статус должен быть 400
        response = self.client.post(self.list_url, self.invalid_data_without_filial, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("filial", response.data)
        # Сообщение может быть на русском: "Обязательное поле."
        self.assertEqual(str(response.data["filial"][0]), "Обязательное поле.")

    def test_update_filial_department(self):
        """Проверяем обновление подразделения через PUT запрос."""
        department = FilialDepartment.objects.create(**self.valid_model_data)
        detail_url = reverse('filialdepartment-detail', kwargs={'id': department.id})
        update_data = {
            "name": "Отдел снабжения",
            "filial": self.filial.id
        }
        response = self.client.put(detail_url, update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        department.refresh_from_db()
        self.assertEqual(department.name, "Отдел снабжения")
        self.assertEqual(response.data["name"], "Отдел снабжения")

    def test_update_filial_department_with_unknown_field(self):
        """Проверяем, что попытка обновить подразделение с неизвестным полем приводит к ошибке."""
        department = FilialDepartment.objects.create(**self.valid_model_data)
        detail_url = reverse('filialdepartment-detail', kwargs={'id': department.id})
        update_data = {"nonexistent": "value"}
        response = self.client.put(detail_url, update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("nonexistent", response.data)
        self.assertEqual(response.data["nonexistent"][0], "This field is not allowed.")

    def test_destroy_filial_department(self):
        """Проверяем удаление подразделения через DELETE запрос."""
        department = FilialDepartment.objects.create(**self.valid_model_data)
        detail_url = reverse('filialdepartment-detail', kwargs={'id': department.id})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(FilialDepartment.objects.filter(id=department.id).exists())
