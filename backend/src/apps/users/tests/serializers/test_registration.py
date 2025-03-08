from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from apps.users.serializers.registration import RegistrationSerializer

User = get_user_model()


class RegistrationSerializerTest(TestCase):
    def setUp(self):
        # Создаем пользователя для проверки ошибки дублирования username
        self.existing_user = User.objects.create_user(username='existinguser', password='Validpass123')
        self.valid_data = {
            'username': 'newuser',
            'password': 'Validpass123',
            'password2': 'Validpass123',
            'email': 'valid@example.com',
            'first_name': 'Ivan',
            'last_name': 'Ivanov',
            'patronymic': 'Ivanovich',
            'avatar': None,
        }

    def test_valid_registration(self):
        serializer = RegistrationSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        # Проверяем, что поле password2 удалено из validated_data
        self.assertNotIn('password2', serializer.validated_data)
        user = serializer.save()
        self.assertEqual(user.username, self.valid_data['username'])
        self.assertEqual(user.email, self.valid_data['email'])
        self.assertEqual(user.first_name, self.valid_data['first_name'])
        self.assertEqual(user.last_name, self.valid_data['last_name'])
        self.assertEqual(user.patronymic, self.valid_data['patronymic'])
        # Проверяем, что пароль не хранится в виде открытого текста
        self.assertNotEqual(user.password, self.valid_data['password'])

    def test_password_mismatch(self):
        data = self.valid_data.copy()
        data['password2'] = 'Differentpass123'
        serializer = RegistrationSerializer(data=data)
        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
        # Ошибка должна возвращаться по ключу "password"
        self.assertIn('password', context.exception.detail)
        self.assertEqual(
            context.exception.detail['password'][0],
            "Пароли не совпадают."
        )

    def test_invalid_username(self):
        # Предположим, что валидатор username требует минимум 6 символов
        data = self.valid_data.copy()
        data['username'] = 'abc'  # слишком короткое
        serializer = RegistrationSerializer(data=data)
        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
        self.assertIn('username', context.exception.detail)
        self.assertIn("не менее", context.exception.detail['username'][0].lower())

    def test_invalid_password(self):
        # Предположим, что валидатор пароля требует наличие цифр, заглавных и строчных букв, минимум 8 символов.
        data = self.valid_data.copy()
        data['password'] = 'short'
        data['password2'] = 'short'
        serializer = RegistrationSerializer(data=data)
        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
        self.assertIn('password', context.exception.detail)
        self.assertIn("не менее", context.exception.detail['password'][0].lower())

    def test_invalid_email_format(self):
        data = self.valid_data.copy()
        data['email'] = 'invalid-email'
        serializer = RegistrationSerializer(data=data)
        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
        self.assertIn('email', context.exception.detail)
        self.assertIn("Введите правильный адрес электронной почты.", context.exception.detail['email'])

    def test_blank_email_allowed(self):
        data = self.valid_data.copy()
        data['email'] = ''
        serializer = RegistrationSerializer(data=data)
        # Если email пустой, валидация проходит, так как extra_kwargs позволяют blank значение
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_invalid_first_name(self):
        data = self.valid_data.copy()
        data['first_name'] = 'Ivan123'
        serializer = RegistrationSerializer(data=data)
        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
        self.assertIn('first_name', context.exception.detail)
        self.assertIn("только буквы", context.exception.detail['first_name'][0].lower())

    def test_invalid_last_name(self):
        data = self.valid_data.copy()
        data['last_name'] = 'Ivanov!'
        serializer = RegistrationSerializer(data=data)
        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
        self.assertIn('last_name', context.exception.detail)
        self.assertIn("только буквы", context.exception.detail['last_name'][0].lower())

    def test_invalid_patronymic(self):
        data = self.valid_data.copy()
        data['patronymic'] = 'Ivanov123'
        serializer = RegistrationSerializer(data=data)
        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
        self.assertIn('patronymic', context.exception.detail)
        self.assertIn("только буквы", context.exception.detail['patronymic'][0].lower())

    def test_duplicate_username(self):
        data = self.valid_data.copy()
        data['username'] = self.existing_user.username
        serializer = RegistrationSerializer(data=data)
        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
        self.assertIn('username', context.exception.detail)
        self.assertIn("уже существует", context.exception.detail['username'][0].lower())

    def test_optional_fields_absent(self):
        data = self.valid_data.copy()
        # Удаляем необязательные поля
        data.pop('email')
        data.pop('patronymic')
        data.pop('avatar')
        serializer = RegistrationSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
