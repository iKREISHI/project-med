from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from apps.clients.models.contractor import Contractor

User = get_user_model()


class ContractorViewSetTestCase(APITestCase):
    def setUp(self):
        # Создаем суперпользователя и аутентифицируем его,
        # чтобы пройти проверки разрешений (DjangoModelPermissions)
        self.admin_user = User.objects.create_superuser(username='admin', password='adminpass')
        self.client.force_authenticate(user=self.admin_user)

        # Корректные данные для создания контрагента
        self.valid_data = {
            "full_name": "ООО Ромашка",
            "inn": "123456789012",  # 12 цифр
            "kpp": "123456789",  # опционально, но передаем для теста
            "bank_account": "40702810000000000001",
            "economic_activity_type": "Торговля",
            "ownership_form": "ООО",
            "insurance_organization": "Страховая компания"
        }

        # URL для list endpoint, предполагается, что ViewSet зарегистрирован с basename 'contractor'
        self.list_url = reverse('contractor-list')

    def test_list_contractors(self):
        """Проверяет, что list endpoint возвращает список контрагентов с пагинацией."""
        # Создаем два контрагента
        Contractor.objects.create(**self.valid_data)
        data2 = self.valid_data.copy()
        data2["full_name"] = "ЗАО Ландыш"
        data2["inn"] = "987654321098"
        Contractor.objects.create(**data2)

        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Если пагинация включена, ответ будет словарем с ключами count, results и т.д.
        if isinstance(response.data, dict):
            self.assertIn("count", response.data)
            self.assertIn("results", response.data)
            self.assertEqual(response.data["count"], 2)
        else:
            # Если пагинация не применяется, ответ будет списком
            self.assertEqual(len(response.data), 2)

    def test_retrieve_contractor(self):
        """Проверяет получение контрагента по id."""
        contractor = Contractor.objects.create(**self.valid_data)
        detail_url = reverse('contractor-detail', kwargs={'id': contractor.id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["full_name"], self.valid_data["full_name"])

    def test_create_contractor(self):
        """Проверяет создание контрагента через POST с корректными данными."""
        response = self.client.post(self.list_url, self.valid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["full_name"], self.valid_data["full_name"])
        self.assertEqual(response.data["inn"], self.valid_data["inn"])
        self.assertTrue(Contractor.objects.filter(full_name=self.valid_data["full_name"]).exists())

    def test_update_contractor(self):
        """Проверяет обновление контрагента через PUT запрос."""
        contractor = Contractor.objects.create(**self.valid_data)
        detail_url = reverse('contractor-detail', kwargs={'id': contractor.id})
        update_data = {
            "full_name": "ООО Новая Ромашка",
            "inn": "123456789012",
            "kpp": "123456789",
            "bank_account": "40702810000000000001",
            "economic_activity_type": "Торговля",
            "ownership_form": "ООО",
            "insurance_organization": "Страховая компания"
        }
        response = self.client.put(detail_url, update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        contractor.refresh_from_db()
        self.assertEqual(contractor.full_name, "ООО Новая Ромашка")

    def test_update_contractor_with_unknown_field(self):
        """Проверяет, что попытка обновить контрагента с неизвестным полем приводит к ошибке."""
        contractor = Contractor.objects.create(**self.valid_data)
        detail_url = reverse('contractor-detail', kwargs={'id': contractor.id})
        update_data = {"nonexistent_field": "value"}
        response = self.client.put(detail_url, update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("nonexistent_field", response.data)
        self.assertEqual(response.data["nonexistent_field"][0], "This field is not allowed.")

    def test_destroy_contractor(self):
        """Проверяет удаление контрагента через DELETE запрос."""
        contractor = Contractor.objects.create(**self.valid_data)
        detail_url = reverse('contractor-detail', kwargs={'id': contractor.id})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Contractor.objects.filter(id=contractor.id).exists())
