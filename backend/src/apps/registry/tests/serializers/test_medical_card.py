from django.test import TestCase
from apps.registry.serializers import MedicalCardSerializer
from apps.clients.models import Patient
from apps.company_structure.models import Filial
from apps.staffing.models import Employee
import datetime


class MedicalCardSerializerTestCase(TestCase):
    def setUp(self):
        # Создаем связанные объекты
        self.patient = Patient.objects.create(first_name="John", last_name="Doe")
        # Предполагается, что для Filial обязательны поля house, street, city
        self.filial = Filial.objects.create(house="1", street="Main Street", city="TestCity")
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
            phone="1234567890"
        )

        # Формируем корректный набор данных для создания MedicalCard.
        # Для полей-связей передаем их pk, так как используются PrimaryKeyRelatedField.
        self.valid_data = {
            "client": self.patient.pk,
            "card_type": "TypeA",
            "comment": "Test comment",
            "filial": self.filial.pk,
            "is_signed": True,
            "signed_by": self.employee.pk
        }

    def test_create_medical_card_valid(self):
        """Проверяет создание медицинской карты с валидными данными."""
        serializer = MedicalCardSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        card = serializer.save()
        self.assertIsNotNone(card.pk)
        self.assertEqual(card.card_type, self.valid_data["card_type"])
        self.assertEqual(card.comment, self.valid_data["comment"])
        self.assertEqual(card.client.pk, self.patient.pk)
        self.assertEqual(card.filial.pk, self.filial.pk)
        self.assertTrue(card.is_signed)
        self.assertEqual(card.signed_by.pk, self.employee.pk)
        self.assertIsNotNone(card.signed_date)
        self.assertIsNotNone(card.date_created)

    def test_update_medical_card_valid(self):
        """Проверяет корректное частичное обновление медицинской карты."""
        # Сначала создаем объект
        serializer = MedicalCardSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        card = serializer.save()
        # Обновляем данные
        update_data = {
            "card_type": "TypeB",
            "comment": "Updated comment"
        }
        serializer_update = MedicalCardSerializer(instance=card, data=update_data, partial=True)
        self.assertTrue(serializer_update.is_valid(), serializer_update.errors)
        updated_card = serializer_update.save()
        self.assertEqual(updated_card.card_type, "TypeB")
        self.assertEqual(updated_card.comment, "Updated comment")

    def test_unknown_field_error(self):
        """Проверяет, что при наличии неизвестного поля выбрасывается ошибка валидации."""
        data = self.valid_data.copy()
        data["unknown_field"] = "unexpected"
        serializer = MedicalCardSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("unknown_field", serializer.errors)
        self.assertEqual(serializer.errors["unknown_field"][0], "This field is not allowed.")

    def test_invalid_card_type(self):
        """Проверяет, что если для поля card_type передано не строковое значение, возникает ошибка."""
        data = self.valid_data.copy()
        data["card_type"] = 12345  # Передаем число вместо строки
        serializer = MedicalCardSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("card_type", serializer.errors)
        self.assertEqual(serializer.errors["card_type"][0], "This field must be a string.")
