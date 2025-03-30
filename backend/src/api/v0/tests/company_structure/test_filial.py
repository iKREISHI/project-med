from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from apps.company_structure.models.filial import Filial
from apps.company_structure.serializers import FilialSerializer

User = get_user_model()


class FilialViewSetTestCase(APITestCase):
    def setUp(self):
        # Создаем суперпользователя для прохождения проверки разрешений
        self.admin_user = User.objects.create_superuser(username='admin', password='adminpass')
        self.client.force_authenticate(user=self.admin_user)
        # URL list endpoint, предполагаем, что FilialViewSet зарегистрирован с basename 'filial'
        self.list_url = reverse('filial-list')

    def test_list_filials(self):
        """Проверяем, что list endpoint возвращает список филиалов с пагинацией."""
        # Создаем несколько филиалов
        Filial.objects.create(house="10", street="Ленина", city="Москва", building="1")
        Filial.objects.create(house="20", street="Пушкина", city="Санкт-Петербург")
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertIn("count", data)
        self.assertIn("results", data)
        # Проверяем, что создано 2 записи
        self.assertEqual(data["count"], 2)
        self.assertEqual(len(data["results"]), 2)
        # Проверяем, что сериализованные данные содержат поля house, street, city
        for filial_data in data["results"]:
            self.assertIn("house", filial_data)
            self.assertIn("street", filial_data)
            self.assertIn("city", filial_data)

    def test_retrieve_filial(self):
        """Проверяем получение филиала по id."""
        filial = Filial.objects.create(house="15", street="Центральная", city="Казань", building="3")
        detail_url = reverse('filial-detail', kwargs={'id': filial.id})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Проверяем, что ответ содержит корректное значение поля city
        self.assertEqual(response.data["city"], "Казань")

    def test_create_filial_with_building(self):
        """Проверяем создание филиала через POST с указанным строением."""
        data = {
            "house": "25",
            "building": "2Б",
            "street": "Октябрьская",
            "city": "Новосибирск"
        }
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Проверяем, что объект создан и поля соответствуют данным
        self.assertEqual(response.data["house"], "25")
        self.assertEqual(response.data["building"], "2Б")
        self.assertEqual(response.data["street"], "Октябрьская")
        self.assertEqual(response.data["city"], "Новосибирск")

    def test_create_filial_without_building(self):
        """Проверяем создание филиала через POST без указания строения."""
        data = {
            "house": "30",
            "street": "Советская",
            "city": "Екатеринбург"
        }
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["house"], "30")
        self.assertEqual(response.data["street"], "Советская")
        self.assertEqual(response.data["city"], "Екатеринбург")
        self.assertIsNone(response.data.get("building"))

    def test_update_filial(self):
        """Проверяем обновление филиала через PUT запрос."""
        filial = Filial.objects.create(house="40", street="Мира", city="Самара", building="3")
        detail_url = reverse('filial-detail', kwargs={'id': filial.id})
        update_data = {
            "house": "41",
            "building": "4",
            "street": "Мира",
            "city": "Самара"
        }
        response = self.client.put(detail_url, update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        filial.refresh_from_db()
        self.assertEqual(filial.house, "41")
        self.assertEqual(filial.building, "4")

    def test_update_filial_with_unknown_field(self):
        """Проверяем, что при попытке обновить филиал с неизвестным полем возникает ошибка."""
        filial = Filial.objects.create(house="50", street="Солнечная", city="Ростов-на-Дону")
        detail_url = reverse('filial-detail', kwargs={'id': filial.id})
        update_data = {"nonexistent": "value"}
        response = self.client.put(detail_url, update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("nonexistent", response.data)
        self.assertEqual(response.data["nonexistent"][0], "This field is not allowed.")

    def test_destroy_filial(self):
        """Проверяем удаление филиала через DELETE запрос."""
        filial = Filial.objects.create(house="60", street="Звёздная", city="Воронеж")
        detail_url = reverse('filial-detail', kwargs={'id': filial.id})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Filial.objects.filter(id=filial.id).exists())
