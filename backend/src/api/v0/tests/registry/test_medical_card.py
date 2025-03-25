import datetime
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

from apps.registry.models.medical_card import MedicalCard
from apps.registry.models.medical_card_type import MedicalCardType
from apps.registry.services import MedicalCardService
from apps.registry.serializers.medical_card import MedicalCardSerializer
from apps.clients.models import Patient
from apps.company_structure.models import Filial
from apps.staffing.models import Employee

User = get_user_model()


class MedicalCardViewSetTestCase(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(username='admin', password='adminpass')
        self.client.force_authenticate(user=self.admin_user)

        # Создаем необходимые объекты для тестов
        self.patient = Patient.objects.create(first_name="John", last_name="Doe")
        self.filial = Filial.objects.create(house="1", street="Main Street", city="TestCity")
        self.employee = Employee.objects.create(
            first_name="Alice",
            last_name="Smith",
            gender="F",
            date_of_birth=datetime.date(1990, 1, 1),
            snils="123-456-789 00",
            inn="1234567890",
            registration_address="Address 1",
            actual_address="Address 2",
            email="alice@example.com",
            phone="+1234567890"
        )
        # Создаем тип медицинской карты для тестовых данных
        self.medical_card_type = MedicalCardType.objects.create(name="TypeA")

        # Дополнены обязательное поле "name" для модели MedicalCard
        self.valid_data_service = {
            "name": "Test Medical Card",
            "client": self.patient,
            "card_type": self.medical_card_type,
            "comment": "Test comment",
            "filial": self.filial,
            "is_signed": True,
            "signed_by": self.employee
        }
        self.valid_data_api = {
            "name": "Test Medical Card",
            "client": self.patient.pk,
            "card_type": self.medical_card_type.pk,
            "comment": "Test comment",
            "filial": self.filial.pk,
            "is_signed": True,
            "signed_by": self.employee.pk
        }

        self.list_url = reverse('medical-card-list')

    def test_list_medical_cards(self):
        """Проверяем, что list endpoint возвращает медицинские карты с пагинацией."""
        for i in range(15):
            # Для каждого цикла создаем уникальное имя и тип карты
            card_type_instance = MedicalCardType.objects.create(name=f"Type {i}")
            data = self.valid_data_service.copy()
            data["name"] = f"Test Medical Card {i}"
            data["card_type"] = card_type_instance
            MedicalCardService.create_medical_card(**data)

        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data_response = response.data
        self.assertIn("count", data_response)
        self.assertIn("next", data_response)
        self.assertIn("previous", data_response)
        self.assertIn("results", data_response)
        self.assertEqual(data_response["count"], 15)
        # По умолчанию возвращается 10 объектов на странице
        self.assertEqual(len(data_response["results"]), 10)

    def test_retrieve_medical_card_valid(self):
        """Проверяем получение существующей медицинской карты по UUID."""
        card = MedicalCardService.create_medical_card(**self.valid_data_service)
        detail_url = reverse('medical-card-detail', kwargs={'pk': card.id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Сравниваем идентификатор типа карты, возвращаемый API, с id созданного объекта
        self.assertEqual(response.data["card_type"], card.card_type.id)

    def test_retrieve_medical_card_not_found(self):
        """Проверяем, что при запросе несуществующей карты возвращается 404."""
        detail_url = reverse('medical-card-detail', kwargs={'pk': 999999})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["detail"], "Медицинская карта не найдена.")

    def test_create_medical_card_valid(self):
        """Проверяем создание медицинской карты через POST запрос с корректными данными."""
        response = self.client.post(self.list_url, self.valid_data_api, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        card_id = response.data.get("id")
        card = MedicalCard.objects.filter(id=card_id).first()
        self.assertIsNotNone(card)
        self.assertEqual(card.card_type.id, self.valid_data_api["card_type"])

    def test_create_medical_card_invalid(self):
        """Проверяем, что при создании с недопустимыми данными (например, пустое поле name) возвращается 400."""
        invalid_data = self.valid_data_api.copy()
        invalid_data["name"] = ""  # Пустое имя должно вызвать ошибку валидации
        response = self.client.post(self.list_url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)

    def test_update_medical_card_valid(self):
        """Проверяем частичное обновление медицинской карты через PATCH запрос."""
        card = MedicalCardService.create_medical_card(**self.valid_data_service)
        detail_url = reverse('medical-card-detail', kwargs={'pk': card.id})
        # Создаем новый тип карты для обновления
        new_card_type = MedicalCardType.objects.create(name="UpdatedType")
        update_data = {
            "card_type": new_card_type.pk,
            "comment": "Updated comment"
        }
        response = self.client.patch(detail_url, update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        card.refresh_from_db()
        self.assertEqual(card.card_type.id, new_card_type.pk)
        self.assertEqual(card.comment, "Updated comment")

    def test_destroy_medical_card_valid(self):
        """Проверяем удаление медицинской карты через DELETE запрос."""
        card = MedicalCardService.create_medical_card(**self.valid_data_service)
        detail_url = reverse('medical-card-detail', kwargs={'pk': card.pk})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertIsNone(MedicalCard.objects.filter(pk=card.pk).first())

    def test_search_medical_cards(self):
        """Проверяем поиск медицинских карт по заданным полям."""
        # Создаем несколько медицинских карт с различными значениями поля "name"
        data_alpha = self.valid_data_service.copy()
        data_alpha["name"] = "Alpha Card"
        card_alpha = MedicalCardService.create_medical_card(**data_alpha)

        data_beta = self.valid_data_service.copy()
        data_beta["name"] = "Beta Card"
        card_beta = MedicalCardService.create_medical_card(**data_beta)

        data_gamma = self.valid_data_service.copy()
        data_gamma["name"] = "Gamma Card"
        card_gamma = MedicalCardService.create_medical_card(**data_gamma)

        # Поиск по имени "Alpha"
        response = self.client.get(self.list_url, {'search': 'Alpha'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Проверяем, что найден только один результат с именем "Alpha Card"
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['name'], "Alpha Card")

        # Поиск по фамилии клиента "Doe"
        response = self.client.get(self.list_url, {'search': 'Doe'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Все созданные карты используют одного пациента "John Doe"
        # Поэтому результат должен содержать все 3 созданных карты
        self.assertEqual(response.data['count'], 3)

        # Поиск по типу карты (card_type__name)
        # Медицинские карты созданы с типом, равным self.medical_card_type.name, т.е. "TypeA"
        response = self.client.get(self.list_url, {'search': "TypeA"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 3)
