import datetime
from django.test import TestCase
from django.contrib.auth import get_user_model

from apps.clients.models import Patient
from apps.clients.models.contractor import Contractor


class PatientModelTest(TestCase):
    def setUp(self):

        User = get_user_model()
        self.user = User.objects.create_user(
            username='testuser', password='secret'
        )

        self.contractor = Contractor.objects.create(
            full_name="Test Contractor",
            inn='0123456789',
            kpp='773601001',
        )

        self.patient = Patient.objects.create(
            last_name="Иванов",
            first_name="Иван",
            patronymic="Иванович",
            gender="M",
            date_of_birth=datetime.date(1990, 1, 1),
            registered_by=self.user,
            contractor=self.contractor,
            place_of_work="Офис",
            additional_place_of_work="Удалённо",
            profession="Инженер"
        )

    def test_str_method(self):
        """
        Проверяем, что метод __str__ возвращает строку вида:
        "Пациент <полное имя>"
        """
        expected_str = f"Пациент {self.patient.get_full_name()}"
        self.assertEqual(str(self.patient), expected_str)

    def test_get_full_name(self):
        """
        Проверяем работу метода get_full_name, который объединяет фамилию, имя и отчество.
        """
        expected_full_name = "Иванов Иван Иванович"
        self.assertEqual(self.patient.get_full_name(), expected_full_name)

    def test_related_fields(self):
        """
        Проверяем корректность заполнения полей-связей: registered_by и contractor.
        """
        self.assertEqual(self.patient.registered_by, self.user)
        self.assertEqual(self.patient.contractor, self.contractor)

    def test_legal_representative(self):
        """
        Проверяем возможность установки законного представителя для пациента.
        Создаем нового пациента и назначаем его законным представителем для первого.
        """
        rep = Patient.objects.create(
            last_name="Петров",
            first_name="Петр",
            patronymic="Петрович",
            gender="M",
            date_of_birth=datetime.date(1985, 5, 5)
        )
        self.patient.legal_representative = rep
        self.patient.save()
        self.assertEqual(self.patient.legal_representative, rep)
