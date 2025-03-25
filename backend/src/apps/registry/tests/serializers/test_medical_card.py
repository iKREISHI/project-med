import datetime
from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.registry.models.medical_card import MedicalCard
from apps.registry.models.medical_card_type import MedicalCardType
from apps.clients.models import Patient
from apps.company_structure.models.filial import Filial
from apps.staffing.models import Employee
from apps.registry.serializers.medical_card import MedicalCardSerializer

User = get_user_model()


class MedicalCardSerializerTestCase(TestCase):
    def setUp(self):
        # Создаем необходимые объекты для связей
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
        # Создаем тип медицинской карты, который будет использоваться для генерации номера
        self.card_type_instance = MedicalCardType.objects.create(
            name="Тип1",
            prefix="PRFX",
            begin_number="0001",
            suffix="SFX",
            description="Test type"
        )
        # Формируем корректный набор данных для создания медицинской карты.
        self.valid_data = {
            "name": "Мед. карта №1",
            "number": "",  # оставляем пустым для автогенерации
            "client": self.patient.pk,
            "card_type": self.card_type_instance.pk,  # передаем имя типа
            "comment": "Test comment",
            "filial": self.filial.pk,
            "is_signed": True,
            "signed_by": self.employee.pk
        }

    def test_valid_creation(self):
        """Проверяет, что сериализатор валиден, создает объект и генерирует номер карты корректно."""
        serializer = MedicalCardSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        medical_card = serializer.save()
        # Проверяем, что объект создан
        self.assertIsInstance(medical_card, MedicalCard)
        self.assertEqual(medical_card.name, self.valid_data["name"])
        self.assertEqual(medical_card.client.pk, self.patient.pk)
        # Ожидается, что в момент сохранения, если поле number пустое, оно будет сгенерировано
        expected_number = f"{self.card_type_instance.prefix}{self.card_type_instance.begin_number}{medical_card.pk}{self.card_type_instance.suffix}"
        self.assertEqual(medical_card.number, expected_number)
        self.assertEqual(medical_card.comment, self.valid_data["comment"])
        self.assertEqual(medical_card.filial.pk, self.filial.pk)
        self.assertTrue(medical_card.is_signed)
        self.assertEqual(medical_card.signed_by.pk, self.employee.pk)
        self.assertIsNotNone(medical_card.date_created)
        self.assertIsNotNone(medical_card.signed_date)

    def test_unknown_field_error(self):
        """Проверяет, что при передаче неизвестного поля сериализатор возвращает ошибку."""
        invalid_data = self.valid_data.copy()
        invalid_data["unknown_field"] = "unexpected value"
        serializer = MedicalCardSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("unknown_field", serializer.errors)
        self.assertEqual(serializer.errors["unknown_field"][0], "This field is not allowed.")

    def test_update_medical_card(self):
        """Проверяет корректное частичное обновление записи через метод update."""
        serializer = MedicalCardSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        medical_card = serializer.save()
        # Обновляем поля: изменим name и comment
        update_data = {
            "name": "Обновленная мед. карта",
            "comment": "Updated comment"
        }
        serializer_update = MedicalCardSerializer(instance=medical_card, data=update_data, partial=True)
        self.assertTrue(serializer_update.is_valid(), serializer_update.errors)
        updated_card = serializer_update.save()
        self.assertEqual(updated_card.name, "Обновленная мед. карта")
        self.assertEqual(updated_card.comment, "Updated comment")
        # Остальные поля остаются без изменений
        self.assertEqual(updated_card.client.pk, self.patient.pk)
        self.assertEqual(updated_card.filial.pk, self.filial.pk)

    def test_to_representation(self):
        """Проверяет, что метод to_representation возвращает корректные данные."""
        serializer = MedicalCardSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        medical_card = serializer.save()
        rep = MedicalCardSerializer(medical_card).data
        # Проверяем, что возвращаемые данные содержат ожидаемые ключи
        self.assertEqual(rep["name"], self.valid_data["name"])
        self.assertEqual(rep["client"], self.patient.pk)
        self.assertEqual(rep["card_type"], self.valid_data["card_type"])
        self.assertEqual(rep["comment"], self.valid_data["comment"])
        self.assertEqual(rep["filial"], self.filial.pk)
        self.assertEqual(rep["is_signed"], True)
        self.assertEqual(rep["signed_by"], self.employee.pk)
        self.assertIsNotNone(rep["date_created"])
