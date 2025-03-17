from datetime import datetime
from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.users.services import GetUserService

User = get_user_model()


class GetUserServiceTests(TestCase):
    def setUp(self):
        # Создаем несколько пользователей для тестирования
        self.user1 = User.objects.create_user(
            username='user1', password='testpassword'
        )
        self.user2 = User.objects.create_user(
            username='user2', password='testpassword'
        )
        # Для проверки фильтра по дате создаем пользователей с одинаковой датой
        self.specific_date = datetime(2020, 1, 1, 12, 0, 0)
        self.user3 = User.objects.create_user(
            username='user3', password='testpassword', date_joined=self.specific_date
        )
        self.user4 = User.objects.create_user(
            username='user4', password='testpassword', date_joined=self.specific_date
        )

    def test_get_user_by_username_found(self):
        """
        Проверяет, что при существующем имени пользователя метод возвращает корректного пользователя.
        """
        result = GetUserService.get_user_by_username('user1')
        self.assertIsNotNone(result)
        self.assertEqual(result.username, 'user1')

    def test_get_user_by_username_not_found(self):
        """
        Проверяет, что при несуществующем имени пользователя метод возвращает None.
        """
        result = GetUserService.get_user_by_username('nonexistent')
        self.assertIsNone(result)

    def test_get_user_by_uuid_found(self):
        """
        Проверяет, что метод возвращает пользователя по валидному uuid.
        """
        uuid_str = str(self.user2.uuid)
        result = GetUserService.get_user_by_uuid(uuid_str)
        self.assertIsNotNone(result)
        self.assertEqual(str(result.uuid), uuid_str)

    def test_get_user_by_uuid_not_found(self):
        """
        Проверяет, что при несуществующем uuid метод возвращает None.
        """
        fake_uuid = '00000000-0000-0000-0000-000000000000'
        result = GetUserService.get_user_by_uuid(fake_uuid)
        self.assertIsNone(result)

    def test_get_users_by_date_joined_found(self):
        """
        Проверяет, что метод возвращает список пользователей, дата создания аккаунта которых равна переданной.
        """
        results = GetUserService.get_users_by_date_joined(self.specific_date)
        self.assertEqual(len(results), 2)
        usernames = {user.username for user in results}
        self.assertSetEqual(usernames, {'user3', 'user4'})

    def test_get_users_by_date_joined_not_found(self):
        """
        Проверяет, что метод возвращает пустой список, если ни у одного пользователя дата создания не совпадает.
        """
        random_date = datetime(1999, 1, 1, 12, 0, 0)
        results = GetUserService.get_users_by_date_joined(random_date)
        self.assertEqual(len(results), 0)
