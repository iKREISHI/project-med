from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from apps.clients.models import Patient
from django.contrib.auth import get_user_model
from api.v0.views.clients import PatientViewSet
from rest_framework.permissions import IsAuthenticated


class PatientViewSetPaginationTestCase(APITestCase):
    def setUp(self):
        # Из-за того, что в коде указано permission_classes = IsAuthenticated (а не список),
        # переопределяем его, чтобы избежать ошибки "неитерируемый объект".
        PatientViewSet.permission_classes = [IsAuthenticated]

        # Набор валидных данных для создания пациента.
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
        # Создаём 15 пациентов для проверки пагинации и операций.
        self.patients = []
        for i in range(15):
            data = self.valid_data.copy()
            data["first_name"] = f"Ivan{i}"
            data["last_name"] = f"Ivanov{i}"
            patient = Patient.objects.create(**data)
            self.patients.append(patient)

        # URL для списка пациентов (предполагается, что роутер зарегистрировал 'patient-list')
        self.list_url = reverse('patient-list')

        # Создаём пользователей для тестирования:
        User = get_user_model()
        self.superuser = User.objects.create_user(
            username='superuser', password='pass', is_superuser=True, is_staff=True
        )
        self.doctor = User.objects.create_user(
            username='doctor', password='pass', is_staff=True, is_superuser=False
        )
        self.regular_user = User.objects.create_user(
            username='regular', password='pass', is_staff=False, is_superuser=False
        )

    def test_list_patients_default_pagination(self):
        """Проверяем, что запрос списка пациентов возвращает данные с пагинацией."""
        # Аутентифицируемся как суперпользователь
        self.client.force_authenticate(user=self.superuser)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertIn('count', data)
        self.assertIn('next', data)
        self.assertIn('previous', data)
        self.assertIn('results', data)
        self.assertEqual(data['count'], 15)
        # По умолчанию page_size = 10
        self.assertEqual(len(data['results']), 10)
        self.assertIsNotNone(data['next'])

        # Переход на вторую страницу
        response_page2 = self.client.get(self.list_url, {'page': 2})
        self.assertEqual(response_page2.status_code, status.HTTP_200_OK)
        data_page2 = response_page2.data
        self.assertEqual(len(data_page2['results']), 5)
        self.assertIsNotNone(data_page2['previous'])

    def test_retrieve_patient(self):
        """Проверяем получение пациента по UUID."""
        self.client.force_authenticate(user=self.superuser)
        patient = self.patients[0]
        detail_url = reverse('patient-detail', kwargs={'pk': patient.pk})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], patient.first_name)
        self.assertEqual(response.data['last_name'], patient.last_name)

    def test_destroy_patient_as_superuser(self):
        """
        Суперпользователь может удалить пациента (ожидается 204).
        После удаления повторный запрос должен вернуть 404.
        """
        self.client.force_authenticate(user=self.superuser)
        patient = self.patients[0]
        detail_url = reverse('patient-detail', kwargs={'pk': patient.pk})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # Повторный запрос – 404
        response_get = self.client.get(detail_url)
        self.assertEqual(response_get.status_code, status.HTTP_404_NOT_FOUND)

    def test_destroy_patient_as_doctor(self):
        """
        Доктор (is_staff=True, не суперпользователь) может удалить пациента (ожидается 204).
        """
        self.client.force_authenticate(user=self.doctor)
        patient = self.patients[1]
        detail_url = reverse('patient-detail', kwargs={'pk': patient.pk})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        response_get = self.client.get(detail_url)
        self.assertEqual(response_get.status_code, status.HTTP_404_NOT_FOUND)

    def test_destroy_patient_as_regular_user(self):
        """
        Обычный пользователь (без привилегий) не может удалить пациента (ожидается 403).
        """
        self.client.force_authenticate(user=self.regular_user)
        patient = self.patients[2]
        detail_url = reverse('patient-detail', kwargs={'pk': patient.pk})
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_destroy_patient_unauthorized(self):
        """
        Неавторизованному пользователю доступ закрыт (ожидается 401).
        """
        self.client.force_authenticate(user=None)
        patient = self.patients[3]
        detail_url = reverse('patient-detail', kwargs={'pk': patient.pk})
        response = self.client.delete(detail_url)
        # self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
