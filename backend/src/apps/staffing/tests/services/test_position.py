from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.auth.models import Group
from apps.staffing.models import Position
from apps.staffing.services import PositionService

class PositionServiceTestCase(TestCase):
    def setUp(self):
        # Создаем тестовую группу для связки с должностью.
        self.group = Group.objects.create(name="Test Group")
        # Набор корректных данных для создания должности.
        self.valid_data = {
            "group": self.group,
            "name": "Test Position",
            "short_name": "TestPos",
            "minzdrav_position": "TestMinPos"
        }

    def test_create_position_valid(self):
        """Проверяет создание должности с корректными данными."""
        position = PositionService.create_position(**self.valid_data)
        self.assertIsNotNone(position.pk)
        self.assertEqual(position.name, self.valid_data["name"])
        self.assertEqual(position.short_name, self.valid_data["short_name"])
        self.assertEqual(position.minzdrav_position, self.valid_data["minzdrav_position"])
        self.assertEqual(position.group, self.group)

    def test_create_position_invalid(self):
        """Проверяет, что создание должности с неверными данными вызывает ValidationError.
           Например, если name пустой (и валидатор считает это недопустимым)."""
        invalid_data = self.valid_data.copy()
        invalid_data["name"] = ""
        with self.assertRaises(ValidationError):
            PositionService.create_position(**invalid_data)

    def test_update_position_valid(self):
        """Проверяет корректное обновление данных должности."""
        position = PositionService.create_position(**self.valid_data)
        new_data = {
            "name": "Updated Position",
            "short_name": "UpdPos",
            "minzdrav_position": "UpdMinPos"
        }
        updated_position = PositionService.update_position(position, **new_data)
        self.assertEqual(updated_position.name, "Updated Position")
        self.assertEqual(updated_position.short_name, "UpdPos")
        self.assertEqual(updated_position.minzdrav_position, "UpdMinPos")

    def test_update_position_invalid_field(self):
        """Проверяет, что попытка обновления несуществующего поля приводит к ValueError."""
        position = PositionService.create_position(**self.valid_data)
        with self.assertRaises(ValueError) as context:
            PositionService.update_position(position, non_existent_field="value")
        self.assertIn("Position has no field", str(context.exception))

    def test_get_position_by_uuid(self):
        """Проверяет получение должности по ID."""
        position = PositionService.create_position(**self.valid_data)
        retrieved = PositionService.get_position_by_pk(position.pk)
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved.pk, position.pk)

    def test_delete_position(self):
        """Проверяет удаление должности."""
        position = PositionService.create_position(**self.valid_data)
        pk = position.pk
        PositionService.delete_position(position)
        self.assertIsNone(Position.objects.filter(pk=pk).first())
