from django.test import TestCase
from apps.staffing.models import Position  # Подкорректируйте путь импорта под вашу структуру

class PositionModelTest(TestCase):
    def setUp(self):
        # Создаём объект «Должность» в базе
        self.position = Position.objects.create(
            name="Врач-терапевт",
            short_name="Терапевт",
            minzdrav_position="Врач терапевтического профиля"
        )

    def test_position_created_successfully(self):
        """
        Проверяем, что объект «Position» корректно создался и сохранился в БД.
        """
        self.assertEqual(Position.objects.count(), 1)
        position = Position.objects.first()
        self.assertEqual(position.name, "Врач-терапевт")
        self.assertEqual(position.short_name, "Терапевт")
        self.assertEqual(position.minzdrav_position, "Врач терапевтического профиля")

    def test_str_method(self):
        """
        Проверяем, что метод __str__ возвращает название должности.
        """
        self.assertEqual(str(self.position), "Врач-терапевт")

    def test_get_short_name(self):
        """
        Проверяем, что метод get_short_name() возвращает значение short_name.
        """
        self.assertEqual(self.position.get_short_name(), "Терапевт")

    def test_empty_short_name(self):
        """
        Проверяем поведение, когда short_name не указан.
        """
        empty_short_position = Position.objects.create(
            name="Врач-хирург",
            short_name=None,
            minzdrav_position="Хирург"
        )
        self.assertIsNone(empty_short_position.short_name)
        self.assertEqual(empty_short_position.get_short_name(), None)
