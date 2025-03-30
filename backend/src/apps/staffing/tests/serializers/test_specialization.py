from django.test import TestCase
from rest_framework.exceptions import ValidationError
from apps.staffing.serializers import SpecializationSerializer  # измените путь, если необходимо


class SpecializationSerializerTestCase(TestCase):
    def setUp(self):
        # Предполагается, что у модели Specialization есть поле 'name'
        self.valid_data = {"title": "Cardiology"}

    def test_valid_specialization(self):
        """
        Проверяет, что сериализатор корректно обрабатывает валидные данные.
        """
        serializer = SpecializationSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        validated_data = serializer.validated_data
        self.assertEqual(validated_data["title"], "Cardiology")

    def test_extra_field_error(self):
        """
        Проверяет, что при передаче неописанного поля выбрасывается ValidationError.
        """
        data_with_extra = self.valid_data.copy()
        data_with_extra["unknown_field"] = "unexpected value"
        serializer = SpecializationSerializer(data=data_with_extra)
        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)
        errors = context.exception.detail
        self.assertIn("unknown_field", errors)
        self.assertEqual(errors["unknown_field"][0], "This field is not allowed.")

    def test_read_only_field(self):
        """
        Проверяет, что поле 'id', определённое как read-only, не попадает в validated_data.
        """
        data_with_id = self.valid_data.copy()
        data_with_id["id"] = 1
        serializer = SpecializationSerializer(data=data_with_id)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        validated_data = serializer.validated_data
        self.assertNotIn("id", validated_data)
