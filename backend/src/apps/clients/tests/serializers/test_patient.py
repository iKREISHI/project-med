from django.core.exceptions import ValidationError
from django.test import TestCase
from apps.clients.models import Patient
from apps.clients.serializers import PatientSerializer
from apps.clients.services import PatientService

class PatientSerializerTestCase(TestCase):
    def setUp(self):
        # Предполагается, что AbstractPersonModel требует поля first_name и last_name.
        self.valid_data = {
            "first_name": "Ivan",
            "last_name": "Ivanov",
            "place_of_work": "Some valid workplace",
            "additional_place_of_work": "Additional valid workplace",
            "profession": "Engineer",
            "registered_by": None,
            "contractor": None,
            "legal_representative": None,
        }

    def test_create_patient_valid(self):
        """Проверяем создание пациента с корректными данными."""
        serializer = PatientSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        patient = serializer.save()
        self.assertIsInstance(patient, Patient)
        self.assertEqual(patient.first_name, self.valid_data["first_name"])
        self.assertEqual(patient.place_of_work, self.valid_data["place_of_work"])

    def test_update_patient_valid(self):
        """Проверяем обновление пациента с корректными данными."""
        serializer = PatientSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        patient = serializer.save()

        update_data = {
            "first_name": "Petr",
            "last_name": "Petrov",
            "place_of_work": "Updated workplace"
        }
        serializer = PatientSerializer(instance=patient, data=update_data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_patient = serializer.save()
        self.assertEqual(updated_patient.first_name, "Petr")
        self.assertEqual(updated_patient.place_of_work, "Updated workplace")

    def test_create_patient_invalid_missing_required_field(self):
        """Проверяем ошибку валидации при отсутствии обязательного поля (first_name)."""
        invalid_data = self.valid_data.copy()
        invalid_data.pop("first_name", None)
        serializer = PatientSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("first_name", serializer.errors)

    def test_create_patient_invalid_extra_field(self):
        """Проверяем ошибку валидации при наличии несуществующего поля."""
        invalid_data = self.valid_data.copy()
        invalid_data["non_existing_field"] = "unexpected value"
        serializer = PatientSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("non_existing_field", serializer.errors)

    def test_create_patient_invalid_place_of_work_type(self):
        """Проверяем ошибку валидации при передаче неверного типа данных для поля place_of_work."""
        invalid_data = self.valid_data.copy()
        invalid_data["place_of_work"] = 12345  # Передаем число вместо строки
        serializer = PatientSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("place_of_work", serializer.errors)

    def test_update_patient_invalid_legal_representative(self):
        """
        Проверяем, что попытка установить пациента в качестве своего законного представителя
        приводит к ошибке валидации (логика clean модели должна это отрабатывать).
        """
        serializer = PatientSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        patient = serializer.save()

        # Передаем свой же pk в качестве законного представителя
        update_data = {"legal_representative": patient.pk}
        serializer = PatientSerializer(instance=patient, data=update_data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        with self.assertRaises(ValidationError):
            serializer.save()
