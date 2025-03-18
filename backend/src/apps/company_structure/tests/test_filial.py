from django.test import TestCase
import uuid

from apps.company_structure.models import Filial


class FilialModelTest(TestCase):
    def setUp(self):
        self.filial_with_building = Filial.objects.create(
            house="15",
            building="2А",
            street="Ленина",
            city="Москва"
        )

        self.filial_without_building = Filial.objects.create(
            house="42",
            street="Центральная",
            city="Санкт-Петербург"
        )

    def test_filial_created_successfully(self):
        self.assertEqual(Filial.objects.count(), 2)

        filial1 = Filial.objects.get(pk=self.filial_with_building.pk)
        self.assertEqual(filial1.house, "15")
        self.assertEqual(filial1.building, "2А")
        self.assertEqual(filial1.street, "Ленина")
        self.assertEqual(filial1.city, "Москва")
        self.assertIsInstance(filial1.uuid, uuid.UUID)

        filial2 = Filial.objects.get(pk=self.filial_without_building.pk)
        self.assertEqual(filial2.house, "42")
        self.assertIsNone(filial2.building)
        self.assertEqual(filial2.street, "Центральная")
        self.assertEqual(filial2.city, "Санкт-Петербург")

    def test_str_method_with_building(self):
        """Проверка строкового представления с заполненным building"""
        expected_str = "Город Москва улица Ленина дом 15 строение2А"
        self.assertEqual(str(self.filial_with_building), expected_str)

    def test_str_method_without_building(self):
        """Проверка строкового представления без building"""
        expected_str = "Город Санкт-Петербург улица Центральная дом 42"
        self.assertEqual(str(self.filial_without_building), expected_str)

    def test_building_optional(self):
        """Проверка необязательности поля building"""
        filial = Filial.objects.create(
            house="9",
            street="Садовый проезд",
            city="Казань"
        )
        self.assertIsNone(filial.building)

        # Проверка сохранения с пустым building
        filial.building = ""
        filial.save()
        self.assertEqual(filial.building, "")

    def test_uuid_generated_and_unique(self):
        """Проверка генерации UUID и его уникальности"""
        filial1 = Filial.objects.create(
            house="1",
            street="Тестовая",
            city="Город"
        )
        filial2 = Filial.objects.create(
            house="2",
            street="Другая",
            city="Город"
        )

        self.assertNotEqual(filial1.uuid, filial2.uuid)
        self.assertEqual(len(str(filial1.uuid)), 36)  # Проверка формата UUID