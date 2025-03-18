import uuid
from django.test import TestCase
from django.core.exceptions import ValidationError
from apps.clients.models import Contractor
from apps.clients.services import ContractorService

class ContractorServiceTests(TestCase):
    def setUp(self):
        # Валидные данные для создания контрагента
        self.valid_data = {
            "full_name": "ООО Ромашка",
            "inn": "123456789012",
            "kpp": "123456789",
            "bank_account": "40702810800000000001",
            "economic_activity_type": "Производство",
            "ownership_form": "ООО",
            "insurance_organization": "Страховая компания",
        }

    def test_create_contractor_success(self):
        """
        Проверяет, что метод create_contractor успешно создает контрагента с корректными данными.
        """
        contractor = ContractorService.create_contractor(**self.valid_data)
        self.assertIsInstance(contractor, Contractor)
        self.assertEqual(contractor.full_name, self.valid_data["full_name"])
        self.assertEqual(contractor.inn, self.valid_data["inn"])

    def test_create_contractor_invalid_data(self):
        """
        Проверяет, что при передаче невалидных данных (например, пустое full_name)
        выбрасывается ValidationError.
        """
        invalid_data = self.valid_data.copy()
        invalid_data["full_name"] = ""  # full_name обязателен
        with self.assertRaises(ValidationError):
            ContractorService.create_contractor(**invalid_data)

    def test_update_contractor_success(self):
        """
        Проверяет, что метод update_contractor успешно обновляет поля контрагента.
        """
        contractor = ContractorService.create_contractor(**self.valid_data)
        updated_data = {
            "full_name": "ООО Новая Ромашка",
            "inn": "987654321098"
        }
        updated_contractor = ContractorService.update_contractor(contractor, **updated_data)
        self.assertEqual(updated_contractor.full_name, "ООО Новая Ромашка")
        self.assertEqual(updated_contractor.inn, "987654321098")
        # Проверяем обновление в базе данных
        contractor.refresh_from_db()
        self.assertEqual(contractor.full_name, "ООО Новая Ромашка")
        self.assertEqual(contractor.inn, "987654321098")

    def test_update_contractor_invalid_field(self):
        """
        Проверяет, что при попытке обновить несуществующее поле
        метод update_contractor выбрасывает ValueError.
        """
        contractor = ContractorService.create_contractor(**self.valid_data)
        with self.assertRaises(ValueError) as context:
            ContractorService.update_contractor(contractor, non_existent_field="value")
        self.assertIn("Контрагент не имеет поля", str(context.exception))

    def test_get_contractor_by_uuid_found(self):
        """
        Проверяет, что метод get_contractor_by_uuid возвращает контрагента,
        если объект с указанным UUID существует.
        """
        contractor = ContractorService.create_contractor(**self.valid_data)
        contractor_uuid_str = str(contractor.uuid)
        fetched_contractor = ContractorService.get_contractor_by_uuid(contractor_uuid_str)
        self.assertIsNotNone(fetched_contractor)
        self.assertEqual(fetched_contractor.pk, contractor.pk)

    def test_get_contractor_by_uuid_not_found(self):
        """
        Проверяет, что метод get_contractor_by_uuid возвращает None,
        если контрагент с указанным UUID отсутствует.
        """
        fake_uuid = str(uuid.uuid4())
        fetched_contractor = ContractorService.get_contractor_by_uuid(fake_uuid)
        self.assertIsNone(fetched_contractor)

    def test_delete_contractor(self):
        """
        Проверяет, что метод delete_contractor удаляет контрагента из базы данных.
        """
        contractor = ContractorService.create_contractor(**self.valid_data)
        pk = contractor.pk
        ContractorService.delete_contractor(contractor)
        self.assertFalse(Contractor.objects.filter(pk=pk).exists())
