from django.test import TestCase
from rest_framework.exceptions import ValidationError
from apps.medical_activity.models.diagnosis_category import DiagnosisCategory
from apps.medical_activity.serializers.diagnosis_category import DiagnosisCategorySerializer


class DiagnosisCategorySerializerTestCase(TestCase):
    def setUp(self):
        # Создаем объект категории диагноза для тестов
        self.category = DiagnosisCategory.objects.create(
            name="Cardiology",
            description="Category for heart-related diagnoses"
        )

    def test_serializer_fields(self):
        """Проверяем, что сериализатор возвращает все ожидаемые поля."""
        serializer = DiagnosisCategorySerializer(instance=self.category)
        data = serializer.data

        # Проверяем, что поля присутствуют и корректны
        self.assertEqual(data["id"], self.category.id)
        self.assertEqual(data["name"], "Cardiology")
        self.assertEqual(data["description"], "Category for heart-related diagnoses")

    def test_to_internal_value_unknown_field(self):
        """Проверяем, что передача неизвестного поля вызывает ValidationError."""
        payload = {
            "name": "Neurology",
            "description": "Category for neurological diagnoses",
            "unknown_field": "unexpected"
        }
        serializer = DiagnosisCategorySerializer(data=payload)
        self.assertFalse(serializer.is_valid())
        self.assertIn("unknown_field", serializer.errors)
        self.assertEqual(serializer.errors["unknown_field"], ["This field is not allowed."])

    def test_read_only_fields_on_update(self):
        """
        Проверяем, что поля, отмеченные как read_only,
        не обновляются при вызове метода update.
        """
        payload = {
            "name": "Updated Cardiology",
            "description": "Updated description",
            "id": 999  # Попытка изменить read_only поле
        }
        serializer = DiagnosisCategorySerializer(instance=self.category, data=payload, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_category = serializer.save()

        # Поле name и description должны обновиться
        self.assertEqual(updated_category.name, "Updated Cardiology")
        self.assertEqual(updated_category.description, "Updated description")
        # Read-only поле id не должно измениться
        self.assertEqual(updated_category.id, self.category.id)
