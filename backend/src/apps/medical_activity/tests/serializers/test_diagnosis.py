from django.test import TestCase
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from apps.medical_activity.models.diagnosis import Diagnosis
from apps.medical_activity.serializers.diagnosis import DiagnosisSerializer
from apps.medical_activity.models import DiagnosisCategory


class DiagnosisSerializerTestCase(TestCase):
    def setUp(self):
        # Если модель DiagnosisCategory доступна, создадим тестовую категорию
        if DiagnosisCategory:
            self.category = DiagnosisCategory.objects.create(name="Category A")
        else:
            self.category = None

        self.diagnosis = Diagnosis.objects.create(
            name="Flu",
            description="Influenza virus infection",
            code="J10",
            category=self.category,
            synonym="Influenza, Grippe"
        )

    def test_serializer_fields(self):
        """Проверяем, что сериализатор возвращает все ожидаемые поля."""
        serializer = DiagnosisSerializer(instance=self.diagnosis)
        data = serializer.data

        self.assertEqual(data["id"], self.diagnosis.id)
        self.assertEqual(data["name"], "Flu")
        self.assertEqual(data["description"], "Influenza virus infection")
        self.assertEqual(data["code"], "J10")
        if self.category:
            self.assertEqual(data["category"], self.category.id)
        else:
            self.assertIsNone(data["category"])
        self.assertEqual(data["synonym"], "Influenza, Grippe")
        # Проверяем, что поля read_only присутствуют
        self.assertIn("date_created", data)
        self.assertIn("date_updated", data)

    def test_to_internal_value_unknown_field(self):
        """Проверяем, что передача неизвестного поля вызывает ошибку валидации."""
        payload = {
            "name": "Flu",
            "description": "Influenza virus infection",
            "code": "J10",
            "category": self.category.id if self.category else None,
            "synonym": "Influenza, Grippe",
            "unknown_field": "unexpected"
        }
        serializer = DiagnosisSerializer(data=payload)
        self.assertFalse(serializer.is_valid())
        self.assertIn("unknown_field", serializer.errors)
        self.assertEqual(serializer.errors["unknown_field"], ["This field is not allowed."])

    def test_read_only_fields(self):
        """
        Проверяем, что поля, отмеченные как read_only,
        не могут быть обновлены через сериализатор.
        """
        payload = {
            "name": "Updated Flu",
            "date_created": "2020-01-01T00:00:00Z",
            "date_updated": "2020-01-01T00:00:00Z"
        }
        serializer = DiagnosisSerializer(instance=self.diagnosis, data=payload, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_diagnosis = serializer.save()

        # Имя должно обновиться, а значения read_only полей должны остаться неизменными
        self.assertEqual(updated_diagnosis.name, "Updated Flu")
        # Проверяем, что значения дат не равны переданным фиктивным датам
        self.assertNotEqual(updated_diagnosis.date_created.strftime("%Y-%m-%dT%H:%M:%SZ"), "2020-01-01T00:00:00Z")
        self.assertNotEqual(updated_diagnosis.date_updated.strftime("%Y-%m-%dT%H:%M:%SZ"), "2020-01-01T00:00:00Z")
