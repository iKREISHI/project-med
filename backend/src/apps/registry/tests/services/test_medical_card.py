import datetime
from django.test import TestCase
from django.core.exceptions import ValidationError

from apps.registry.models import MedicalCard
from apps.registry.services import MedicalCardService
from apps.clients.models import Patient
from apps.company_structure.models import Filial
from apps.staffing.models import Employee


class MedicalCardServiceTestCase(TestCase):
    def setUp(self):
        # Создаем тестового пациента (минимальные поля)
        self.patient = Patient.objects.create(
            first_name="John",
            last_name="Doe"
        )

        # Создаем тестовый филиал.
        # Предполагается, что модель Filial требует, например, house, street и city.
        self.filial = Filial.objects.create(
            house="1",
            street="Main Street",
            city="TestCity"
        )

        # Создаем тестового сотрудника, который будет использоваться в качестве подписанта.
        self.employee = Employee.objects.create(
            first_name="Alice",
            last_name="Smith",
            gender="F",
            date_of_birth=datetime.date(1990, 1, 1),
            snils="123-456-789 00",
            inn="1234567890",
            registration_address="Address 1",
            actual_address="Address 2",
            email="alice@example.com",
            phone="+1234567890"
        )

        # Определяем корректный набор данных для создания MedicalCard.
        self.valid_data = {
            "client": self.patient,
            "card_type": "TypeA",
            "comment": "Test comment",
            "filial": self.filial,
            "is_signed": True,
            "signed_by": self.employee
        }

    def test_create_medical_card_valid(self):
        """Проверяет создание медицинской карты с корректными данными."""
        card = MedicalCardService.create_medical_card(**self.valid_data)
        self.assertIsNotNone(card.pk)
        self.assertEqual(card.client, self.patient)
        self.assertEqual(card.card_type, "TypeA")
        self.assertEqual(card.comment, "Test comment")
        self.assertEqual(card.filial, self.filial)
        self.assertTrue(card.is_signed)
        self.assertEqual(card.signed_by, self.employee)
        self.assertIsNotNone(card.signed_date)
        self.assertIsNotNone(card.date_created)

    def test_create_medical_card_invalid(self):
        """
        Проверяет, что создание медицинской карты с отсутствующим обязательным полем card_type
        вызывает ValidationError.
        """
        invalid_data = self.valid_data.copy()
        invalid_data["card_type"] = ""  # card_type не должен быть пустым
        with self.assertRaises(ValidationError):
            MedicalCardService.create_medical_card(**invalid_data)

    def test_update_medical_card_valid(self):
        """Проверяет корректное обновление полей медицинской карты."""
        card = MedicalCardService.create_medical_card(**self.valid_data)
        update_data = {
            "card_type": "TypeB",
            "comment": "Updated comment"
        }
        updated_card = MedicalCardService.update_medical_card(card, **update_data)
        self.assertEqual(updated_card.card_type, "TypeB")
        self.assertEqual(updated_card.comment, "Updated comment")

    def test_update_medical_card_invalid_field(self):
        """
        Проверяет, что попытка обновления медицинской карты с несуществующим полем
        приводит к выбросу ValueError.
        """
        card = MedicalCardService.create_medical_card(**self.valid_data)
        with self.assertRaises(ValueError) as context:
            MedicalCardService.update_medical_card(card, nonexistent="value")
        self.assertIn("MedicalCard has no field", str(context.exception))

    def test_get_medical_card_by_uuid(self):
        """Проверяет, что поиск медицинской карты по UUID возвращает правильный объект."""
        card = MedicalCardService.create_medical_card(**self.valid_data)
        retrieved = MedicalCardService.get_medical_card_by_uuid(str(card.uuid))
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved.pk, card.pk)

    def test_delete_medical_card(self):
        """Проверяет удаление медицинской карты."""
        card = MedicalCardService.create_medical_card(**self.valid_data)
        pk = card.pk
        MedicalCardService.delete_medical_card(card)
        self.assertIsNone(MedicalCard.objects.filter(pk=pk).first())
