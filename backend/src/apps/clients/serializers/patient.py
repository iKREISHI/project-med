from rest_framework import serializers
from apps.clients.models import Patient
from apps.clients.services import PatientService


class StrictCharField(serializers.CharField):
    def to_internal_value(self, data):
        if not isinstance(data, str):
            raise serializers.ValidationError("This field must be a string.")
        return super().to_internal_value(data)


class PatientSerializer(serializers.ModelSerializer):
    # Переопределяем поле, чтобы не принимать числовые значения
    place_of_work = StrictCharField(allow_blank=True, allow_null=True, required=False)

    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ('id',)

    def to_internal_value(self, data):
        # Если в data есть ключи, не описанные в serializer.fields, выбрасываем ошибку
        unknown = set(data.keys()) - set(self.fields.keys())
        if unknown:
            errors = {field: ["This field is not allowed."] for field in unknown}
            raise serializers.ValidationError(errors)
        return super().to_internal_value(data)

    def create(self, validated_data):
        return PatientService.create_patient(**validated_data)

    def update(self, instance, validated_data):
        return PatientService.update_patient(instance, **validated_data)
