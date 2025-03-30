import datetime
from django.test import TestCase
from apps.registry.models.medical_card import MedicalCard
from apps.registry.models.medical_card_type import MedicalCardType
from apps.clients.models import Patient
from apps.company_structure.models.filial import Filial
from apps.staffing.models import Employee

class MedicalCardModelTest(TestCase):
    def setUp(self):
        # Создаем тестового сотрудника для полей, унаследованных от AbstractElectronicSignature
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
        # Создаем тестового пациента
        self.patient = Patient.objects.create(
            first_name="Patient",
            last_name="Test"
        )
        # Создаем тестовый филиал
        self.filial = Filial.objects.create(
            house="1",
            street="TestStreet",
            city="TestCity"
        )
        # Создаем тип медицинской карты
        self.medical_card_type = MedicalCardType.objects.create(
            name="Тип1",
            prefix="PRFX",
            begin_number="0001",
            suffix="SFX",
            description="Test description"
        )
        self.comment = "Test comment"
        # Создаем медицинскую карту с пустым номером (для автогенерации)
        self.medical_card = MedicalCard.objects.create(
            name="Мед. карта №1",
            number="",  # оставляем пустым для автогенерации
            client=self.patient,
            card_type=self.medical_card_type,
            comment=self.comment,
            filial=self.filial,
            is_signed=True,
            signed_by=self.employee
        )
        # Обновляем объект для получения сгенерированного поля number
        self.medical_card.refresh_from_db()

    def test_creation(self):
        """Проверяет корректное создание MedicalCard и формирование номера карты."""
        self.assertIsNotNone(self.medical_card.pk)
        self.assertEqual(self.medical_card.client, self.patient)
        self.assertEqual(self.medical_card.card_type, self.medical_card_type)
        self.assertEqual(self.medical_card.comment, self.comment)
        self.assertEqual(self.medical_card.filial, self.filial)
        self.assertTrue(self.medical_card.is_signed)
        self.assertEqual(self.medical_card.signed_by, self.employee)
        self.assertIsNotNone(self.medical_card.signed_date)
        self.assertIsNotNone(self.medical_card.date_created)
        # Ожидаемый номер карты: prefix + begin_number + pk + suffix
        expected_number = f"{self.medical_card_type.prefix}{self.medical_card_type.begin_number}{self.medical_card.pk}{self.medical_card_type.suffix}"
        self.assertEqual(self.medical_card.number, expected_number)

    def test_str_method(self):
        """
        Проверяет, что метод __str__ возвращает корректное строковое представление.
        Ожидаемый формат: "Мед. карта <client> (<number>)"
        """
        expected_number = f"{self.medical_card_type.prefix}{self.medical_card_type.begin_number}{self.medical_card.pk}{self.medical_card_type.suffix}"
        expected_str = f"Мед. карта {self.patient} ({expected_number})"
        self.assertEqual(str(self.medical_card), expected_str)

    def test_reverse_accessor_patient(self):
        """
        Проверяет, что обратная связь для пациента работает корректно.
        Для поля client задан related_name='medical_cards'.
        """
        self.assertIn(self.medical_card, self.patient.medical_cards.all())

    def test_reverse_accessor_filial(self):
        """
        Проверяет, что обратная связь для филиала работает корректно.
        Для поля filial используется обратное имя по умолчанию "medicalcard_set".
        """
        self.assertIn(self.medical_card, self.filial.medicalcard_set.all())
