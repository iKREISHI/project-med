import random

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.staffing.models import Specialization
from apps.staffing.serializers import SpecializationSerializer

User = get_user_model()


class SpecializationViewSetTests(APITestCase):
    def setUp(self):
        # Получаем или создаем разрешения для модели Specialization.
        specialization_ct = ContentType.objects.get_for_model(Specialization)
        self.view_permission, _ = Permission.objects.get_or_create(
            codename='view_specialization',
            defaults={'name': 'Can view Specialization', 'content_type': specialization_ct}
        )
        self.add_permission, _ = Permission.objects.get_or_create(
            codename='add_specialization',
            defaults={'name': 'Can add Specialization', 'content_type': specialization_ct}
        )
        self.change_permission, _ = Permission.objects.get_or_create(
            codename='change_specialization',
            defaults={'name': 'Can change Specialization', 'content_type': specialization_ct}
        )
        self.delete_permission, _ = Permission.objects.get_or_create(
            codename='delete_specialization',
            defaults={'name': 'Can delete Specialization', 'content_type': specialization_ct}
        )

        # Создаем тестовую специализацию
        self.specialization = Specialization.objects.create(
            title="Cardiology",
            description="Heart specialist"
        )
        # URL-адреса – предполагается, что router зарегистрировал этот ViewSet под именами 'specialization-list' и 'specialization-detail'
        self.list_url = reverse('specialization-list')
        self.detail_url = reverse('specialization-detail', kwargs={'id': self.specialization.id})

    def create_user_with_perms(self, perms):
        """
        Создает тестового пользователя и назначает ему указанные разрешения.
        :param perms: список кодовых имен, например, ['view_specialization', 'add_specialization']
        """
        user = User.objects.create_user(username='testuser_'+str(random.Random(100)), password='testpass')
        for perm_codename in perms:
            perm = Permission.objects.get(codename=perm_codename)
            user.user_permissions.add(perm)
        user.save()
        return user

    # def test_list_without_view_permission(self):
    #     """
    #     Без разрешения view_specialization запрос списка должен возвращать 403.
    #     Если же GET разрешается по умолчанию для аутентифицированных пользователей,
    #     необходимо использовать кастомный permission-класс, проверяющий view-пермиссию.
    #     """
    #     user = self.create_user_with_perms([])
    #     self.client.force_authenticate(user=user)
    #     response = self.client.get(self.list_url)
    #     self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_with_view_permission(self):
        """С разрешением view_specialization запрос списка должен возвращать 200 и данные."""
        user = self.create_user_with_perms(['view_specialization'])
        self.client.force_authenticate(user=user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Проверяем, что результат пагинирован (наличие ключа 'results')
        self.assertIn('results', response.data)
        self.assertGreaterEqual(len(response.data['results']), 1)

    # def test_retrieve_without_view_permission(self):
    #     """Без разрешения view_specialization запрос деталей должен возвращать 403."""
    #     user = self.create_user_with_perms([])
    #     self.client.force_authenticate(user=user)
    #     response = self.client.get(self.detail_url)
    #     self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_with_view_permission(self):
        """С разрешением view_specialization можно получить детали специализации."""
        user = self.create_user_with_perms(['view_specialization'])
        self.client.force_authenticate(user=user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = SpecializationSerializer(self.specialization)
        self.assertEqual(response.data, serializer.data)

    def test_create_without_add_permission(self):
        """Без разрешения add_specialization создание специализации недоступно (403)."""
        user = self.create_user_with_perms(['view_specialization'])
        self.client.force_authenticate(user=user)
        data = {
            "title": "Neurology",
            "description": "Brain specialist"
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_with_add_permission(self):
        """С разрешением add_specialization создание специализации проходит успешно (201)."""
        user = self.create_user_with_perms(['add_specialization', 'view_specialization'])
        self.client.force_authenticate(user=user)
        data = {
            "title": "Neurology",
            "description": "Brain specialist"
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Specialization.objects.filter(title="Neurology").exists())

    def test_update_without_change_permission(self):
        """Без разрешения change_specialization обновление специализации недоступно (403)."""
        user = self.create_user_with_perms(['view_specialization'])
        self.client.force_authenticate(user=user)
        data = {
            "title": "Updated Title",
            "description": self.specialization.description
        }
        response = self.client.put(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_with_change_permission(self):
        """С разрешением change_specialization обновление специализации проходит успешно (200)."""
        user = self.create_user_with_perms(['change_specialization', 'view_specialization'])
        self.client.force_authenticate(user=user)
        data = {
            "title": "Updated Title",
            "description": "Updated Description"
        }
        response = self.client.put(self.detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.specialization.refresh_from_db()
        self.assertEqual(self.specialization.title, "Updated Title")
        self.assertEqual(self.specialization.description, "Updated Description")

    def test_destroy_without_delete_permission(self):
        """Без разрешения delete_specialization удаление специализации недоступно (403)."""
        user = self.create_user_with_perms(['view_specialization'])
        self.client.force_authenticate(user=user)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_destroy_with_delete_permission(self):
        """С разрешением delete_specialization удаление специализации проходит успешно (204)."""
        user = self.create_user_with_perms(['delete_specialization', 'view_specialization'])
        self.client.force_authenticate(user=user)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Specialization.objects.filter(id=self.specialization.id).exists())
