import unittest
from django.core.exceptions import ValidationError

from apps.clients.validators import (
    validate_place_of_work,
    validate_additional_place_of_work,
    validate_profession,
    validate_legal_representative,
)

class DummyPatient:
    """
    Вспомогательный класс для тестирования validate_legal_representative
    """
    def __init__(self, pk, legal_representative=None):
        self.pk = pk
        self.legal_representative = legal_representative


class ValidatorsTest(unittest.TestCase):
    def test_validate_place_of_work_valid(self):
        try:
            validate_place_of_work(None)
            validate_place_of_work("")
        except ValidationError:
            self.fail("validate_place_of_work вызвал ValidationError для пустого значения.")
        try:
            validate_place_of_work("  офис  ")
        except ValidationError:
            self.fail("validate_place_of_work вызвал ValidationError для валидного значения.")

    def test_validate_place_of_work_invalid(self):
        with self.assertRaises(ValidationError):
            validate_place_of_work(" ab")
        with self.assertRaises(ValidationError):
            validate_place_of_work(" a ")

    def test_validate_additional_place_of_work_valid(self):
        try:
            validate_additional_place_of_work(None)
            validate_additional_place_of_work("")
            validate_additional_place_of_work("  офис  ")
        except ValidationError:
            self.fail("validate_additional_place_of_work вызвал ValidationError для валидного значения.")

    def test_validate_additional_place_of_work_invalid(self):
        with self.assertRaises(ValidationError):
            validate_additional_place_of_work("ab")
        with self.assertRaises(ValidationError):
            validate_additional_place_of_work("  a ")

    def test_validate_profession_valid(self):
        try:
            validate_profession(None)
            validate_profession("")
            validate_profession("ab")
            validate_profession("Инженер")
        except ValidationError:
            self.fail("validate_profession вызвал ValidationError для валидного значения.")

    def test_validate_profession_invalid(self):
        with self.assertRaises(ValidationError):
            validate_profession("a")
        with self.assertRaises(ValidationError):
            validate_profession(" a ")

    def test_validate_legal_representative_valid(self):
        # Если legal_representative не задан – валидатор не должен вызывать ошибку
        dummy = DummyPatient(pk=1, legal_representative=None)
        try:
            validate_legal_representative(dummy)
        except ValidationError:
            self.fail("validate_legal_representative вызвал ValidationError, когда legal_representative отсутствует.")

        rep = DummyPatient(pk=2)
        dummy2 = DummyPatient(pk=1, legal_representative=rep)
        try:
            validate_legal_representative(dummy2)
        except ValidationError:
            self.fail("validate_legal_representative вызвал ValidationError для корректного законного представителя.")

    def test_validate_legal_representative_invalid(self):
        dummy = DummyPatient(pk=1)
        dummy.legal_representative = dummy
        with self.assertRaises(ValidationError):
            validate_legal_representative(dummy)