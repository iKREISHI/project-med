from django.test import TestCase
from django.utils import timezone
from apps.registry.models import MedicalCard
from apps.clients.models import Patient
from apps.company_structure.models import Filial
from apps.staffing.models import Employee
import datetime


class MedicalCardModelTest(TestCase):
    def setUp(self):

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
            first_name="Test",
            last_name="Patient"
        )

        self.filial = Filial.objects.create(
            house="1",
            street="TestStreet",
            city="TestCity"
        )

        self.card_type = "Тип1"
        self.comment = "Test comment"

        self.medical_card = MedicalCard.objects.create(
            client=self.patient,
            card_type=self.card_type,
            comment=self.comment,
            filial=self.filial,
            is_signed=True,
            signed_by=self.employee
        )

    def test_creation(self):
        """Проверяет, что объект MedicalCard создается корректно и все поля заполнены."""
        self.assertIsNotNone(self.medical_card.pk)
        self.assertEqual(self.medical_card.client, self.patient)
        self.assertEqual(self.medical_card.card_type, self.card_type)
        self.assertEqual(self.medical_card.comment, self.comment)
        self.assertEqual(self.medical_card.filial, self.filial)
        self.assertTrue(self.medical_card.is_signed)
        self.assertEqual(self.medical_card.signed_by, self.employee)
        self.assertIsNotNone(self.medical_card.signed_date)
        self.assertIsNotNone(self.medical_card.date_created)

    def test_str_method(self):
        """
        Проверяет корректность работы метода __str__.
        Ожидаемый формат: "Мед. карта <patient> (<card_type>)".
        """
        expected_str = f"Мед. карта {self.patient} ({self.medical_card.get_card_type_display()})"
        self.assertEqual(str(self.medical_card), expected_str)

    def test_reverse_accessor_patient(self):
        """
        Проверяет, что обратный доступ для пациента работает корректно.
        Для поля client указан related_name='medical_cards', поэтому из объекта Patient можно получить все связанные карты.
        """
        self.assertIn(self.medical_card, self.patient.medical_cards.all())

    def test_reverse_accessor_filial(self):
        """
        Проверяет, что обратный доступ для филиала работает корректно.
        Для поля filial не задан related_name, поэтому используется по умолчанию "medicalcard_set".
        """
        self.assertIn(self.medical_card, self.filial.medicalcard_set.all())
