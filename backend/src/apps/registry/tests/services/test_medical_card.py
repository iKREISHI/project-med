import datetime
from django.test import TestCase
from django.core.exceptions import ValidationError
from apps.registry.models.medical_card import MedicalCard
from apps.registry.models.medical_card_type import MedicalCardType
from apps.clients.models import Patient
from apps.company_structure.models.filial import Filial
from apps.staffing.models import Employee
from apps.registry.services.medical_card import MedicalCardService


class MedicalCardServiceTestCase(TestCase):
    def setUp(self):
        # Создаем необходимые связанные объекты
        self.employee = Employee.objects.create(
            first_name="John",
            last_name="Doe",
            gender="M",
            date_of_birth=datetime.date(2000, 1, 1),
            snils="123-456-789 00",
            inn="1234567890",
            registration_address="Test Address",
            actual_address="Test Address",
            email="john@example.com",
            phone="1234567890"
        )
        self.patient = Patient.objects.create(
            first_name="Patient",
            last_name="Test"
        )
        self.filial = Filial.objects.create(
            house="1",
            street="TestStreet",
            city="TestCity"
        )
        self.card_type = MedicalCardType.objects.create(
            name="Тип1",
            prefix="PRFX",
            begin_number="0001",
            suffix="SFX",
            description="Test description"
        )
        self.comment = "Test comment"
        # В valid_data не передаем поле "number", чтобы оно генерировалось автоматически
        self.valid_data = {
            "name": "Мед. карта №1",
            # "number" не передается
            "client": self.patient,
            "card_type": self.card_type,
            "comment": self.comment,
            "filial": self.filial,
            "is_signed": True,
            "signed_by": self.employee
        }

    def test_create_medical_card_valid(self):
        """Проверяет, что метод create_medical_card создает объект корректно и генерирует номер карты."""
        card = MedicalCardService.create_medical_card(**self.valid_data)
        self.assertIsNotNone(card.pk)
        self.assertEqual(card.name, self.valid_data["name"])
        self.assertEqual(card.client, self.patient)
        self.assertEqual(card.card_type, self.card_type)
        self.assertEqual(card.comment, self.comment)
        self.assertEqual(card.filial, self.filial)
        self.assertTrue(card.is_signed)
        self.assertEqual(card.signed_by, self.employee)
        self.assertIsNotNone(card.date_created)
        self.assertIsNotNone(card.signed_date)
        # Формируем ожидаемый номер карты: prefix + begin_number + pk + suffix
        expected_number = f"{self.card_type.prefix}{self.card_type.begin_number}{card.pk}{self.card_type.suffix}"
        self.assertEqual(card.number, expected_number)

    def test_create_medical_card_invalid(self):
        """Проверяет, что создание с некорректными данными вызывает ValidationError."""
        invalid_data = self.valid_data.copy()
        invalid_data["name"] = ""
        with self.assertRaises(ValidationError):
            MedicalCardService.create_medical_card(**invalid_data)

    def test_update_medical_card_valid(self):
        """Проверяет корректное обновление полей объекта."""
        card = MedicalCardService.create_medical_card(**self.valid_data)
        update_data = {
            "name": "Обновленная мед. карта",
            "comment": "Updated comment"
        }
        updated_card = MedicalCardService.update_medical_card(card, **update_data)
        self.assertEqual(updated_card.name, "Обновленная мед. карта")
        self.assertEqual(updated_card.comment, "Updated comment")
        self.assertEqual(updated_card.client, self.patient)
        self.assertEqual(updated_card.filial, self.filial)
        # Номер карты остается прежним
        expected_number = f"{self.card_type.prefix}{self.card_type.begin_number}{updated_card.pk}{self.card_type.suffix}"
        self.assertEqual(updated_card.number, expected_number)

    def test_update_medical_card_unknown_field(self):
        """Проверяет, что попытка обновления с неизвестным полем вызывает ValueError."""
        card = MedicalCardService.create_medical_card(**self.valid_data)
        with self.assertRaises(ValueError) as context:
            MedicalCardService.update_medical_card(card, unknown_field="value")
        self.assertIn("MedicalCard has no field", str(context.exception))

    def test_update_medical_card_invalid(self):
        """Проверяет, что попытка обновления с некорректными данными (например, пустое имя) приводит к ValidationError."""
        card = MedicalCardService.create_medical_card(**self.valid_data)
        with self.assertRaises(ValidationError):
            MedicalCardService.update_medical_card(card, name="")

    def test_get_medical_card_by_id(self):
        """Проверяет, что get_medical_card_by_id возвращает объект, если он существует, и None иначе."""
        card = MedicalCardService.create_medical_card(**self.valid_data)
        found_card = MedicalCardService.get_medical_card_by_id(card.id)
        self.assertEqual(found_card, card)
        non_existent = MedicalCardService.get_medical_card_by_id(999999)
        self.assertIsNone(non_existent)

    def test_delete_medical_card(self):
        """Проверяет, что delete_medical_card удаляет объект из базы."""
        card = MedicalCardService.create_medical_card(**self.valid_data)
        MedicalCardService.delete_medical_card(card)
        self.assertFalse(MedicalCard.objects.filter(id=card.id).exists())
