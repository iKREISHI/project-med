import unittest
from django.core.exceptions import ValidationError
from apps.clients.validators import (
    validate_full_name,
    validate_inn,
    validate_kpp,
    validate_bank_account,
    validate_economic_activity_type,
    validate_ownership_form,
    validate_insurance_organization,
)

class TestContractorValidators(unittest.TestCase):
    # Тесты для validate_full_name
    def test_validate_full_name_valid(self):
        # Если значение корректное (после обрезки минимум 3 символа), ошибки не должно быть.
        try:
            validate_full_name("John Doe")
            validate_full_name("  ABC  ")
        except ValidationError:
            self.fail("validate_full_name вызвал ValidationError для валидного значения.")

    def test_validate_full_name_invalid(self):
        with self.assertRaises(ValidationError):
            validate_full_name("  AB  ")  # после обрезки "AB" -> длина 2
        with self.assertRaises(ValidationError):
            validate_full_name(" a ")     # после обрезки "a" -> длина 1

    # Тесты для validate_inn
    def test_validate_inn_valid(self):
        # Допустимые варианты: 10 или 12 цифр
        try:
            validate_inn("1234567890")    # 10 цифр
            validate_inn("123456789012")  # 12 цифр
        except ValidationError:
            self.fail("validate_inn вызвал ValidationError для валидного ИНН.")

    def test_validate_inn_invalid(self):
        # Если ИНН содержит нецифровые символы
        with self.assertRaises(ValidationError):
            validate_inn("12345678a0")
        # Если длина ИНН неверная (например, 9 цифр)
        with self.assertRaises(ValidationError):
            validate_inn("123456789")
        # Если длина ИНН неверная (например, 11 цифр)
        with self.assertRaises(ValidationError):
            validate_inn("12345678901")

    # Тесты для validate_kpp
    def test_validate_kpp_valid(self):
        # Если значение не задано, не должно вызываться исключение
        try:
            validate_kpp("")
            validate_kpp(None)
            validate_kpp("123456789")
        except ValidationError:
            self.fail("validate_kpp вызвал ValidationError для валидного значения.")

    def test_validate_kpp_invalid(self):
        # Если КПП содержит недопустимые символы
        with self.assertRaises(ValidationError):
            validate_kpp("12345abc9")
        # Если длина неверная (8 или 10 цифр)
        with self.assertRaises(ValidationError):
            validate_kpp("12345678")
        with self.assertRaises(ValidationError):
            validate_kpp("1234567890")

    # Тесты для validate_bank_account
    def test_validate_bank_account_valid(self):
        try:
            validate_bank_account("1234567890123456")
            # Значение с пробелами должно быть корректным, если после удаления пробелов остаются только цифры
            validate_bank_account("1234 5678 9012 3456")
            validate_bank_account("")
            validate_bank_account(None)
        except ValidationError:
            self.fail("validate_bank_account вызвал ValidationError для валидного значения.")

    def test_validate_bank_account_invalid(self):
        with self.assertRaises(ValidationError):
            validate_bank_account("1234-5678-9012")  # присутствуют дефисы
        with self.assertRaises(ValidationError):
            validate_bank_account("12 34 56 78 ABC")  # содержит буквы

    # Тесты для validate_economic_activity_type
    def test_validate_economic_activity_type_valid(self):
        try:
            validate_economic_activity_type("Retail")
            validate_economic_activity_type("  ITS  ")  # после обрезки "ITS" -> 3 символа
            validate_economic_activity_type(None)
        except ValidationError:
            self.fail("validate_economic_activity_type вызвал ValidationError для валидного значения.")

    def test_validate_economic_activity_type_invalid(self):
        with self.assertRaises(ValidationError):
            validate_economic_activity_type("  ab")  # после обрезки "ab" -> 2 символа
        with self.assertRaises(ValidationError):
            validate_economic_activity_type("  a ")  # после обрезки "a" -> 1 символ

    # Тесты для validate_ownership_form
    def test_validate_ownership_form_valid(self):
        try:
            validate_ownership_form("LLC")
            validate_ownership_form("  LLC  ")
            validate_ownership_form("")
            validate_ownership_form(None)
        except ValidationError:
            self.fail("validate_ownership_form вызвал ValidationError для валидного значения.")

    def test_validate_ownership_form_invalid(self):
        with self.assertRaises(ValidationError):
            validate_ownership_form(" a ")  # после обрезки "a" -> 1 символ

    # Тесты для validate_insurance_organization
    def test_validate_insurance_organization_valid(self):
        try:
            validate_insurance_organization("Insurance Co")
            validate_insurance_organization("  XYZ Insurance  ")
            validate_insurance_organization("")
            validate_insurance_organization(None)
        except ValidationError:
            self.fail("validate_insurance_organization вызвал ValidationError для валидного значения.")

    def test_validate_insurance_organization_invalid(self):
        with self.assertRaises(ValidationError):
            validate_insurance_organization("ab")  # после обрезки длина 2
