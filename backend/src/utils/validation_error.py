from rest_framework.serializers import ValidationError


def raise_validation_error(field_name: str, message: str = '') -> None:
    raise ValidationError(
        {field_name: message}
    )