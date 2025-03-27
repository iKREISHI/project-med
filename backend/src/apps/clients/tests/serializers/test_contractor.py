from django.test import TestCase
from apps.clients.models.contractor import Contractor
from apps.clients.serializers.contractor import ContractorSerializer

class ContractorSerializerTestCase(TestCase):
    def setUp(self):
        self.valid_data = {
            "full_name": "ООО Ромашка",
            "inn": "123456789012",  # 12 цифр, как пример
            "kpp": "123456789",     # опционально
            "bank_account": "40702810000000000001",  # опционально
            "economic_activity_type": "Торговля",
            "ownership_form": "ООО",
            "insurance_organization": "Страховая компания"
        }

    def test_valid_contractor_serialization(self):
        """
        Проверяет, что сериализатор корректно проходит валидацию и сохраняет данные,
        если переданы корректные данные.
        """
        serializer = ContractorSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        contractor = serializer.save()
        self.assertEqual(contractor.full_name, self.valid_data["full_name"])
        self.assertEqual(contractor.inn, self.valid_data["inn"])
        self.assertEqual(contractor.kpp, self.valid_data["kpp"])
        self.assertEqual(contractor.bank_account, self.valid_data["bank_account"])
        self.assertEqual(contractor.economic_activity_type, self.valid_data["economic_activity_type"])
        self.assertEqual(contractor.ownership_form, self.valid_data["ownership_form"])
        self.assertEqual(contractor.insurance_organization, self.valid_data["insurance_organization"])

    def test_to_representation(self):
        """
        Проверяет, что метод to_representation возвращает корректные данные.
        """
        contractor = Contractor.objects.create(**self.valid_data)
        serializer = ContractorSerializer(contractor)
        data = serializer.data
        self.assertEqual(data["full_name"], self.valid_data["full_name"])
        self.assertEqual(data["inn"], self.valid_data["inn"])
        self.assertEqual(data.get("kpp"), self.valid_data["kpp"])

    def test_unknown_field_error(self):
        """
        Проверяет, что при передаче неизвестного поля сериализатор возвращает ошибку валидации.
        """
        invalid_data = self.valid_data.copy()
        invalid_data["unknown_field"] = "unexpected value"
        serializer = ContractorSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("unknown_field", serializer.errors)
        self.assertEqual(serializer.errors["unknown_field"][0], "This field is not allowed.")
