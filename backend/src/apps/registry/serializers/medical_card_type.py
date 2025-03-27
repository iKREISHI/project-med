from rest_framework import serializers
from apps.registry.models.medical_card_type import MedicalCardType


class MedicalCardTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalCardType
        fields = '__all__'
        read_only_fields = ('id',)

    def to_internal_value(self, data):
        # Проверяем, что не переданы неизвестные поля
        unknown = set(data.keys()) - set(self.fields.keys())
        if unknown:
            errors = {field: ["This field is not allowed."] for field in unknown}
            raise serializers.ValidationError(errors)
        return super().to_internal_value(data)
