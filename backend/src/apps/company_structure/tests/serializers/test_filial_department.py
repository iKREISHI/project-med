from django.test import TestCase
from apps.company_structure.models.filial_department import FilialDepartment
from apps.company_structure.models.filial import Filial
from apps.company_structure.serializers.filial_department import FilialDepartmentSerializer


class FilialDepartmentSerializerTestCase(TestCase):
    def setUp(self):
        # Создаем тестовый филиал для случая, когда он передается
        self.filial = Filial.objects.create(
            house="1",
            street="Main Street",
            city="TestCity"
        )
        # Данные с указанным филиалом
        self.valid_data_with_filial = {
            "name": "Отдел продаж",
            "filial": self.filial.id
        }
        # Данные без поля filial (теперь поле обязательно)
        self.invalid_data_without_filial = {
            "name": "Отдел маркетинга"
        }

    def test_valid_filial_department_with_filial(self):
        """Проверка, что сериализатор проходит валидацию, если указан филиал."""
        serializer = FilialDepartmentSerializer(data=self.valid_data_with_filial)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        instance = serializer.save()
        self.assertEqual(instance.name, "Отдел продаж")
        self.assertEqual(instance.filial, self.filial)

    def test_invalid_filial_department_without_filial(self):
        """Проверка, что сериализатор не проходит валидацию, если поле filial отсутствует."""
        serializer = FilialDepartmentSerializer(data=self.invalid_data_without_filial)
        self.assertFalse(serializer.is_valid())
        self.assertIn("filial", serializer.errors)
        # Ожидаем сообщение по умолчанию DRF "This field is required."
        self.assertEqual(str(serializer.errors["filial"][0]), "Обязательное поле.")

    def test_unknown_field_error(self):
        """Проверка, что при передаче неизвестного поля возникает ошибка валидации."""
        data = self.valid_data_with_filial.copy()
        data["unknown_field"] = "unexpected value"
        serializer = FilialDepartmentSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("unknown_field", serializer.errors)
        self.assertEqual(serializer.errors["unknown_field"][0], "This field is not allowed.")
