from django.test import TestCase
from apps.registry.models.medical_card_type import MedicalCardType
from apps.registry.serializers.medical_card_type import MedicalCardTypeSerializer


class MedicalCardTypeSerializerTestCase(TestCase):
    def setUp(self):
        self.valid_data = {
            "name": "Тип1",
            "suffix": "SFX",
            "prefix": "PRFX",
            "begin_number": "0001",
            "description": "Test description"
        }

    def test_valid_data_serialization(self):
        """
        Проверяет, что сериализатор проходит валидацию при корректных данных,
        сохраняет объект и возвращает ожидаемое представление.
        """
        serializer = MedicalCardTypeSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        instance = serializer.save()
        # Проверяем сохранение полей
        self.assertEqual(instance.name, self.valid_data["name"])
        self.assertEqual(instance.suffix, self.valid_data["suffix"])
        self.assertEqual(instance.prefix, self.valid_data["prefix"])
        self.assertEqual(instance.begin_number, self.valid_data["begin_number"])
        self.assertEqual(instance.description, self.valid_data["description"])

        # Проверяем представление данных
        serializer_data = MedicalCardTypeSerializer(instance).data
        self.assertEqual(serializer_data["name"], self.valid_data["name"])
        self.assertEqual(serializer_data["suffix"], self.valid_data["suffix"])
        self.assertEqual(serializer_data["prefix"], self.valid_data["prefix"])
        self.assertEqual(serializer_data["begin_number"], self.valid_data["begin_number"])
        self.assertEqual(serializer_data["description"], self.valid_data["description"])
        self.assertIn("id", serializer_data)

    def test_unknown_field_error(self):
        """
        Проверяет, что при передаче неизвестного поля сериализатор
        возвращает ошибку "This field is not allowed."
        """
        invalid_data = self.valid_data.copy()
        invalid_data["unknown_field"] = "unexpected"
        serializer = MedicalCardTypeSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("unknown_field", serializer.errors)
        self.assertEqual(serializer.errors["unknown_field"][0], "This field is not allowed.")

    def test_read_only_field(self):
        """
        Проверяет, что read-only поле 'id' не может быть передано в качестве входного значения.
        Если оно передано, то оно игнорируется (либо создается новое значение).
        """
        data_with_id = self.valid_data.copy()
        data_with_id["id"] = 999
        serializer = MedicalCardTypeSerializer(data=data_with_id)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        instance = serializer.save()
        # Проверяем, что id объекта сгенерирован автоматически, и не равен переданному значению 999.
        self.assertNotEqual(instance.id, 999)
