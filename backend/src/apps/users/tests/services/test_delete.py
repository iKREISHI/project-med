from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.users.services.delete import DeleteUserService

User = get_user_model()


class DeleteUserServiceTests(TestCase):
    def setUp(self):
        # Создаем тестового пользователя
        self.user = User.objects.create_user(username='testuser', password='TestPassword123')

    def test_delete_user_success(self):
        """
        Тест проверяет, что метод delete_user корректно удаляет пользователя из базы данных.
        """
        service = DeleteUserService(self.user)
        # Вызываем метод удаления
        result = service.delete_user()
        # Метод delete_user не возвращает значения, поэтому result должен быть None
        self.assertIsNone(result)
        # Проверяем, что пользователь больше не существует в базе данных
        self.assertFalse(User.objects.filter(pk=self.user.pk).exists())

    def test_invalid_user_object(self):
        """
        Тест проверяет, что при попытке инициализации DeleteUserService с некорректным объектом выбрасывается ValueError.
        """
        with self.assertRaises(ValueError) as context:
            DeleteUserService("не является пользователем")
        self.assertEqual(str(context.exception), "Неверный объект пользователя")
