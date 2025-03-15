from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from apps.clients.models import Patient
from django.contrib.auth import get_user_model


class PatientViewSetPaginationTestCase(APITestCase):
    def setUp(self):
        # Создаем тестового пользователя с правами (например, is_staff=True) и аутентифицируем его.
        User = get_user_model()
        self.user = User.objects.create_user(username='testuser', password='testpass', is_superuser=True)
        self.client.force_authenticate(user=self.user)

        # Корректный набор данных для создания пациента.
        self.valid_data = {
            "first_name": "Ivan",
            "last_name": "Ivanov",
            "place_of_work": "Some valid workplace",
            "additional_place_of_work": "Additional valid workplace",
            "profession": "Engineer",
            "registered_by": None,
            "contractor": None,
            "legal_representative": None,
        }
        # Создаем 15 пациентов для проверки пагинации.
        self.patients = []
        for i in range(15):
            data = self.valid_data.copy()
            data["first_name"] = f"Ivan{i}"
            data["last_name"] = f"Ivanov{i}"
            patient = Patient.objects.create(**data)
            self.patients.append(patient)

        # Убедитесь, что URL-роутинг настроен с basename='patient'
        self.list_url = reverse('patient-list')

    def test_list_patients_default_pagination(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertIn('count', data)
        self.assertIn('next', data)
        self.assertIn('previous', data)
        self.assertIn('results', data)
        self.assertEqual(data['count'], 15)
        self.assertEqual(len(data['results']), 10)
        self.assertIsNotNone(data['next'])

        response_page2 = self.client.get(self.list_url, {'page': 2})
        self.assertEqual(response_page2.status_code, status.HTTP_200_OK)
        data_page2 = response_page2.data
        self.assertEqual(len(data_page2['results']), 5)
        self.assertIsNotNone(data_page2['previous'])

    def test_retrieve_patient(self):
        patient = self.patients[0]
        detail_url = reverse('patient-detail', kwargs={'uuid': patient.uuid})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], patient.first_name)
        self.assertEqual(response.data['last_name'], patient.last_name)

    def test_destroy_patient_by_superuser(self):
        patient = self.patients[0]
        detail_url = reverse('patient-detail', kwargs={'uuid': patient.uuid})
        print(f'url delete: {detail_url}')
        response = self.client.delete(detail_url)
        print(response.headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        response_get = self.client.get(detail_url)
        self.assertEqual(response_get.status_code, status.HTTP_404_NOT_FOUND)
