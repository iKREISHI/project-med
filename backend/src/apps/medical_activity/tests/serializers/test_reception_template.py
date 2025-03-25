from django.test import TestCase
from apps.medical_activity.models import ReceptionTemplate
from apps.medical_activity.serializers import ReceptionTemplateSerializer
from apps.staffing.models import Specialization


class ReceptionTemplateSerializerTestCase(TestCase):
    def setUp(self):
        # Создаем необходимую специализацию для шаблона приема
        self.specialization = Specialization.objects.create(title="Cardiology")
        # Формируем корректный набор данных для создания шаблона приема
        self.valid_data = {
            "name": "Template 1",
            "description": "A sample template description",
            "html": "<html><body>Test</body></html>",
            "specialization": self.specialization.pk,
            "fields": {"field1": "value1", "field2": "value2"},
        }

    def test_valid_reception_template(self):
        """Проверяет, что сериализатор корректно обрабатывает валидные данные."""
        serializer = ReceptionTemplateSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        instance = serializer.save()
        self.assertIsInstance(instance, ReceptionTemplate)
        self.assertEqual(instance.name, self.valid_data["name"])
        self.assertEqual(instance.description, self.valid_data["description"])
        self.assertEqual(instance.html, self.valid_data["html"])
        self.assertEqual(instance.specialization.pk, self.specialization.pk)
        self.assertEqual(instance.fields, self.valid_data["fields"])

    def test_unknown_field_error(self):
        """Проверяет, что при передаче неизвестного поля выбрасывается ошибка валидации."""
        data = self.valid_data.copy()
        data["unknown_field"] = "unexpected"
        serializer = ReceptionTemplateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("unknown_field", serializer.errors)
        self.assertEqual(serializer.errors["unknown_field"][0], "This field is not allowed.")

    def test_read_only_field(self):
        """Проверяет, что read-only поле 'id' не включается в validated_data даже если оно передано."""
        data = self.valid_data.copy()
        data["id"] = 999  # Пытаемся передать read-only поле
        serializer = ReceptionTemplateSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertNotIn("id", serializer.validated_data)
