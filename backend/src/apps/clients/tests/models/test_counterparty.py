from django.test import TestCase
from apps.clients.models.counterparty import Contractor


class ContractorModelTest(TestCase):
    def setUp(self):
        self.contractor = Contractor.objects.create(
            full_name="Test Contractor Full Name",
            inn="123456789012",  # 12-значный ИНН
            kpp="123456789",
            bank_account="12345678901234567890",
            economic_activity_type="Retail",
            ownership_form="ООО",
            insurance_organization="Test Insurance Org"
        )

    def test_str_method(self):
        """
        Проверяем, что строковое представление модели возвращает значение поля full_name.
        """
        self.assertEqual(str(self.contractor), self.contractor.full_name)

    def test_verbose_names(self):
        """
        Проверяем настройки метаданных модели:
        - verbose_name должно быть "Контрагент"
        - verbose_name_plural должно быть "Контрагенты"
        """
        meta = Contractor._meta
        self.assertEqual(meta.verbose_name, "Контрагент")
        self.assertEqual(meta.verbose_name_plural, "Контрагенты")

    def test_inn_help_text(self):
        """
        Проверяем, что для поля inn задан правильный help_text.
        """
        field = Contractor._meta.get_field("inn")
        self.assertEqual(field.help_text, "Введите 10 или 12 цифр ИНН")

    def test_optional_fields_default_to_none(self):
        """
        Проверяем, что опциональные поля (kpp, bank_account, economic_activity_type,
        ownership_form, insurance_organization) по умолчанию равны None, если не указаны.
        """
        contractor = Contractor.objects.create(
            full_name="Minimal Contractor",
            inn="9876543210"  # допустим, 10-значный ИНН
        )
        self.assertIsNone(contractor.kpp)
        self.assertIsNone(contractor.bank_account)
        self.assertIsNone(contractor.economic_activity_type)
        self.assertIsNone(contractor.ownership_form)
        self.assertIsNone(contractor.insurance_organization)
