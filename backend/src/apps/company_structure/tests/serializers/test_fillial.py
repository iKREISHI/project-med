from django.test import TestCase
from apps.company_structure.models.filial import Filial
from apps.company_structure.serializers import FilialSerializer


class FilialSerializerTestCase(TestCase):
    def setUp(self):
        self.valid_data_with_building = {
            "house": "15",
            "building": "2А",
            "street": "Ленина",
            "city": "Москва"
        }
        self.valid_data_without_building = {
            "house": "42",
            "street": "Центральная",
            "city": "Санкт-Петербург"
        }

    def test_serialization_with_building(self):
        """Проверка сериализации и сохранения, если строение указано."""
        serializer = FilialSerializer(data=self.valid_data_with_building)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        instance = serializer.save()
        self.assertEqual(instance.house, "15")
        self.assertEqual(instance.building, "2А")
        self.assertEqual(instance.street, "Ленина")
        self.assertEqual(instance.city, "Москва")

    def test_serialization_without_building(self):
        """Проверка сериализации и сохранения, если строение не указано."""
        serializer = FilialSerializer(data=self.valid_data_without_building)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        instance = serializer.save()
        self.assertEqual(instance.house, "42")
        self.assertIsNone(instance.building)
        self.assertEqual(instance.street, "Центральная")
        self.assertEqual(instance.city, "Санкт-Петербург")

    def test_str_method(self):
        """Проверка строкового представления модели Filial."""
        filial = Filial.objects.create(**self.valid_data_with_building)
        # Expected string depends on the __str__ implementation.
        expected_str = "Город Москва улица Ленина дом 15 строение2А"
        self.assertEqual(str(filial), expected_str)
