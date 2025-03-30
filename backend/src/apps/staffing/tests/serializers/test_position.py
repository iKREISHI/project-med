from django.test import TestCase
from apps.staffing.models.position import Position
from apps.staffing.serializers.position import PositionSerializer


class PositionSerializerTestCase(TestCase):
    def setUp(self):
        self.valid_data = {
            "name": "Manager",
            "short_name": "Mgr",
            "minzdrav_position": "Manager Min"
        }

    def test_create_position_valid(self):
        """Проверка создания должности с корректными данными."""
        serializer = PositionSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        position = serializer.save()
        self.assertIsInstance(position, Position)
        self.assertEqual(position.name, self.valid_data["name"])
        self.assertEqual(position.short_name, self.valid_data["short_name"])
        self.assertEqual(position.minzdrav_position, self.valid_data["minzdrav_position"])

    def test_update_position_valid(self):
        """Проверка корректного частичного обновления должности."""
        position = Position.objects.create(**self.valid_data)
        update_data = {
            "name": "Updated Manager",
            "short_name": "UpdMgr",
            "minzdrav_position": "Updated Manager Min"
        }
        serializer = PositionSerializer(instance=position, data=update_data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_position = serializer.save()
        self.assertEqual(updated_position.name, update_data["name"])
        self.assertEqual(updated_position.short_name, update_data["short_name"])
        self.assertEqual(updated_position.minzdrav_position, update_data["minzdrav_position"])

    def test_unknown_field_error(self):
        """Проверка ошибки валидации при наличии неизвестного поля."""
        data = self.valid_data.copy()
        data["unknown_field"] = "unexpected"
        serializer = PositionSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("unknown_field", serializer.errors)
        self.assertEqual(serializer.errors["unknown_field"][0], "This field is not allowed.")

    def test_strict_char_field_validation(self):
        """Проверка ошибки валидации, если значение поля не является строкой."""
        data = self.valid_data.copy()
        data["name"] = 12345  # Передаём число вместо строки
        serializer = PositionSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("name", serializer.errors)
        self.assertEqual(serializer.errors["name"][0], "This field must be a string.")
