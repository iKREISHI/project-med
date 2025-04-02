from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

from apps.registry.models.medical_card_type import MedicalCardType

User = get_user_model()


class MedicalCardTypeViewSetTestCase(APITestCase):
    def setUp(self):
        # Создаем администратора и аутентифицируем его
        self.admin_user = User.objects.create_superuser(username='admin', password='adminpass')
        self.client.force_authenticate(user=self.admin_user)
        self.list_url = reverse('medical-card-type-list')
        self.valid_data_api = {
            "name": "Test Type"
        }

    def test_list_medical_card_types(self):
        """
        Проверяем, что endpoint list возвращает объекты с пагинацией:
        - total count равен количеству созданных объектов,
        - по умолчанию на странице 10 объектов.
        """
        # Создаем 15 типов медицинских карт с уникальными именами
        for i in range(15):
            MedicalCardType.objects.create(name=f"Type {i}")
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data_response = response.data
        self.assertIn("count", data_response)
        self.assertIn("next", data_response)
        self.assertIn("previous", data_response)
        self.assertIn("results", data_response)
        self.assertEqual(data_response["count"], 15)
        self.assertEqual(len(data_response["results"]), 10)

    def test_retrieve_medical_card_type_valid(self):
        """
        Проверяем получение существующего типа медицинской карты по ID.
        """
        card_type = MedicalCardType.objects.create(name="Retrieve Test")
        detail_url = reverse('medical-card-type-detail', kwargs={'pk': card_type.pk})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], card_type.name)

    def test_retrieve_medical_card_type_not_found(self):
        """
        Проверяем, что при запросе несуществующего типа возвращается 404.
        """
        detail_url = reverse('medical-card-type-detail', kwargs={'pk': 999999})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("detail", response.data)

    def test_create_medical_card_type_valid(self):
        """
        Проверяем создание типа медицинской карты через POST запрос с корректными данными.
        """
        response = self.client.post(self.list_url, self.valid_data_api, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        card_type_id = response.data.get("id")
        card_type = MedicalCardType.objects.filter(id=card_type_id).first()
        self.assertIsNotNone(card_type)
        self.assertEqual(card_type.name, self.valid_data_api["name"])

    def test_create_medical_card_type_invalid(self):
        """
        Проверяем, что при создании с недопустимыми данными (например, отсутствие обязательного поля "name")
        возвращается 400 и присутствует ошибка для поля "name".
        """
        invalid_data = {}  # "name" отсутствует
        response = self.client.post(self.list_url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)

    def test_update_medical_card_type_valid(self):
        """
        Проверяем частичное обновление типа медицинской карты через PATCH запрос.
        """
        card_type = MedicalCardType.objects.create(name="Old Name")
        detail_url = reverse('medical-card-type-detail', kwargs={'pk': card_type.pk})
        update_data = {"name": "Updated Name"}
        response = self.client.patch(detail_url, update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        card_type.refresh_from_db()
        self.assertEqual(card_type.name, "Updated Name")

    def test_destroy_medical_card_type_valid(self):
        """
        Проверяем удаление типа медицинской карты через DELETE запрос.
        """
        card_type = MedicalCardType.objects.create(name="To be deleted")
        detail_url = reverse('medical-card-type-detail', kwargs={'pk': card_type.pk})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertIsNone(MedicalCardType.objects.filter(pk=card_type.pk).first())
