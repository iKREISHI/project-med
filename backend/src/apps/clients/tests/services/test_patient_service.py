import uuid
from django.test import TestCase
from django.core.exceptions import ValidationError
from apps.clients.models import Patient
from apps.clients.services import PatientService

class PatientServiceTests(TestCase):
    def setUp(self):
        # Валидные данные для создания пациента (требуются хотя бы last_name и first_name)
        self.valid_data = {
            "last_name": "Doe",
            "first_name": "John",
            "patronymic": "Smith",  # опционально
            "gender": "M",  # допустимые варианты: 'M', 'F', 'U'
            "date_of_birth": "1990-01-01",  # формат YYYY-MM-DD
            "snils": "123-456-789 01",
            "inn": "123456789012",  # должно соответствовать max_length=12
            "registration_address": "123 Main St",
            "actual_address": "456 Side Ave",
            "email": "john.doe@example.com",
            "phone": "+1234567890",
        }

    def test_create_patient_success(self):
        """
        Проверяет, что метод create_patient создает пациента с корректными данными.
        """
        patient = PatientService.create_patient(**self.valid_data)
        self.assertIsInstance(patient, Patient)
        self.assertEqual(patient.first_name, self.valid_data["first_name"])
        self.assertEqual(patient.last_name, self.valid_data["last_name"])

    def test_create_patient_invalid_data(self):
        """
        Проверяет, что при создании пациента с невалидными данными (например, пустая фамилия)
        выбрасывается ValidationError.
        """
        invalid_data = self.valid_data.copy()
        invalid_data["last_name"] = ""
        with self.assertRaises(ValidationError):
            PatientService.create_patient(**invalid_data)

    def test_update_patient_success(self):
        """
        Проверяет, что метод update_patient корректно обновляет поля пациента.
        """
        patient = PatientService.create_patient(**self.valid_data)
        updated_patient = PatientService.update_patient(patient, first_name="Jane", email="jane@example.com")
        self.assertEqual(updated_patient.first_name, "Jane")
        self.assertEqual(updated_patient.email, "jane@example.com")
        # Проверка через обновление из базы данных
        patient.refresh_from_db()
        self.assertEqual(patient.first_name, "Jane")
        self.assertEqual(patient.email, "jane@example.com")

    def test_update_patient_invalid_field(self):
        """
        Проверяет, что попытка обновления несуществующего поля приводит к ValueError.
        """
        patient = PatientService.create_patient(**self.valid_data)
        with self.assertRaises(ValueError) as context:
            PatientService.update_patient(patient, non_existent_field="value")
        self.assertIn("Пациент не имеет поля", str(context.exception))

    def test_get_patient_by_uuid_found(self):
        """
        Проверяет, что метод get_patient_by_uuid возвращает пациента, если он существует.
        """
        patient = PatientService.create_patient(**self.valid_data)
        retrieved = PatientService.get_patient_by_id(patient.pk)
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved.pk, patient.pk)

    def test_get_patient_by_id_not_found(self):
        """
        Проверяет, что метод get_patient_by_uuid возвращает None, если пациента с данным UUID нет.
        """
        fake_id = 654367345890673
        retrieved = PatientService.get_patient_by_id(fake_id)
        self.assertIsNone(retrieved)

    def test_delete_patient(self):
        """
        Проверяет, что метод delete_patient удаляет пациента из базы данных.
        """
        patient = PatientService.create_patient(**self.valid_data)
        pk = patient.pk
        PatientService.delete_patient(patient)
        self.assertFalse(Patient.objects.filter(pk=pk).exists())
