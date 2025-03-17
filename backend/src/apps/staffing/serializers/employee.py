from rest_framework import serializers
from apps.staffing.models import Employee
from apps.staffing.services import EmployeeService


class StrictCharField(serializers.CharField):
    def to_internal_value(self, data):
        if not isinstance(data, str):
            raise serializers.ValidationError("This field must be a string.")
        return super().to_internal_value(data)


class EmployeeSerializer(serializers.ModelSerializer):
    short_description = StrictCharField(allow_blank=True, allow_null=True, required=False)

    class Meta:
        model = Employee
        fields = '__all__'

    def to_internal_value(self, data):
        # Если в data присутствуют ключи, которых нет в описании сериализатора – выбрасываем ошибку.
        unknown = set(data.keys()) - set(self.fields.keys())
        if unknown:
            errors = {field: ["This field is not allowed."] for field in unknown}
            raise serializers.ValidationError(errors)
        return super().to_internal_value(data)

    def create(self, validated_data):
        return EmployeeService.create_employee(**validated_data)

    def update(self, instance, validated_data):
        return EmployeeService.update_employee(instance, **validated_data)
