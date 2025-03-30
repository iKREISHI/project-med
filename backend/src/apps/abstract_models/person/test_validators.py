import datetime
from io import BytesIO

from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from .validators import (
    validate_last_name, validate_first_name, validate_patronymic,
    validate_gender, validate_date_of_birth, validate_snils,
    validate_inn, validate_photo_size, validate_phone, validate_address
)


class PersonValidatorsTest(TestCase):

    def test_validate_last_name_valid(self):
        try:
            validate_last_name("Иванов")
        except ValidationError:
            self.fail("validate_last_name() raised ValidationError unexpectedly!")

    def test_validate_last_name_invalid(self):
        with self.assertRaises(ValidationError):
            validate_last_name("Иванов123")  # Содержит цифры, должно упасть

    def test_validate_first_name_valid(self):
        try:
            validate_first_name("Ivan")
        except ValidationError:
            self.fail("validate_first_name() raised ValidationError unexpectedly!")

    def test_validate_first_name_invalid(self):
        with self.assertRaises(ValidationError):
            validate_first_name("John99")  # Содержит цифры, должно упасть

    def test_validate_patronymic_empty(self):
        # Пустое значение допускается, валидатор не должен бросать ошибку
        try:
            validate_patronymic("")
        except ValidationError:
            self.fail("validate_patronymic() raised ValidationError unexpectedly with empty string!")

    def test_validate_patronymic_valid(self):
        try:
            validate_patronymic("Петрович")
        except ValidationError:
            self.fail("validate_patronymic() raised ValidationError unexpectedly!")

    def test_validate_patronymic_invalid(self):
        with self.assertRaises(ValidationError):
            validate_patronymic("Петрович123")  # Содержит цифры

    def test_validate_gender_valid(self):
        for g in ["M", "F", "U"]:
            try:
                validate_gender(g)
            except ValidationError:
                self.fail(f"validate_gender() raised ValidationError unexpectedly with '{g}'!")

    def test_validate_gender_invalid(self):
        with self.assertRaises(ValidationError):
            validate_gender("X")  # Не входит в ['M', 'F', 'U']

    def test_validate_date_of_birth_valid_past(self):
        past_date = datetime.date(1990, 1, 1)
        try:
            validate_date_of_birth(past_date)
        except ValidationError:
            self.fail("validate_date_of_birth() raised ValidationError unexpectedly with a past date!")

    def test_validate_date_of_birth_today(self):
        today = datetime.date.today()
        try:
            validate_date_of_birth(today)
        except ValidationError:
            self.fail("validate_date_of_birth() raised ValidationError unexpectedly with today's date!")

    def test_validate_date_of_birth_future(self):
        future_date = datetime.date.today() + datetime.timedelta(days=1)
        with self.assertRaises(ValidationError):
            validate_date_of_birth(future_date)

    def test_validate_snils_valid_format_with_dashes(self):
        try:
            validate_snils("123-456-789 01")
        except ValidationError:
            self.fail("validate_snils() raised ValidationError unexpectedly with a valid format!")

    def test_validate_snils_valid_format_without_dashes(self):
        try:
            validate_snils("12345678901")
        except ValidationError:
            self.fail("validate_snils() raised ValidationError unexpectedly with a valid format!")

    def test_validate_snils_invalid_format(self):
        with self.assertRaises(ValidationError):
            validate_snils("123-45-678901")  # Некорректный формат

    def test_validate_inn_valid_10_digits(self):
        try:
            validate_inn("1234567890")  # 10 цифр
        except ValidationError:
            self.fail("validate_inn() raised ValidationError unexpectedly with 10 digits!")

    def test_validate_inn_valid_12_digits(self):
        try:
            validate_inn("123456789012")  # 12 цифр
        except ValidationError:
            self.fail("validate_inn() raised ValidationError unexpectedly with 12 digits!")

    def test_validate_inn_invalid_characters(self):
        with self.assertRaises(ValidationError):
            validate_inn("12345ABC90")  # Содержит буквы

    def test_validate_inn_invalid_length(self):
        with self.assertRaises(ValidationError):
            validate_inn("123456789")  # 9 цифр

    def test_validate_photo_size_valid(self):
        # Создаём файл размером ~1 МБ
        content = BytesIO(b"0" * (1024 * 1024))  # 1 MB
        test_file = SimpleUploadedFile("test.jpg", content.getvalue())
        try:
            validate_photo_size(test_file)
        except ValidationError:
            self.fail("validate_photo_size() raised ValidationError unexpectedly with a 1MB file!")

    def test_validate_photo_size_too_large(self):
        # Файл 2 МБ + 1 байт
        content = BytesIO(b"0" * (2 * 1024 * 1024 + 1))
        test_file = SimpleUploadedFile("test.jpg", content.getvalue())
        with self.assertRaises(ValidationError):
            validate_photo_size(test_file)

    def test_validate_phone_valid(self):
        valid_numbers = ["+71234567890", "1234567890", "999999999999999"]  # 15 цифр
        for number in valid_numbers:
            with self.subTest(number=number):
                try:
                    validate_phone(number)
                except ValidationError:
                    self.fail(f"validate_phone() raised ValidationError unexpectedly with '{number}'!")

    def test_validate_phone_invalid_format(self):
        invalid_numbers = ["+12 34567890", "phone", "+12345-678", "123456"]  # слишком короткий, пробел, дефис и т.п.
        for number in invalid_numbers:
            with self.subTest(number=number):
                with self.assertRaises(ValidationError):
                    validate_phone(number)

    def test_validate_address_valid(self):
        try:
            validate_address("ул. Ленина, д. 10")  # Длина > 5
        except ValidationError:
            self.fail("validate_address() raised ValidationError unexpectedly!")

    def test_validate_address_short(self):
        with self.assertRaises(ValidationError):
            validate_address("дом")  # < 5 символов
