from rest_framework import serializers
from apps.registry.models import MedicalCard
from apps.registry.services import MedicalCardService


class StrictCharField(serializers.CharField):
    def to_internal_value(self, data):
        if not isinstance(data, str):
            raise serializers.ValidationError("This field must be a string.")
        return super().to_internal_value(data)


class MedicalCardSerializer(serializers.ModelSerializer):
    # Переопределяем card_type, чтобы принимать только строковые значения
    card_type = StrictCharField()

    class Meta:
        model = MedicalCard
        fields = '__all__'
        read_only_fields = ('id', 'date_created',)

    def to_internal_value(self, data):
        # Если в data присутствуют ключи, которых нет в описании сериализатора, выбрасываем ошибку.
        unknown = set(data.keys()) - set(self.fields.keys())
        if unknown:
            errors = {field: ["This field is not allowed."] for field in unknown}
            raise serializers.ValidationError(errors)
        return super().to_internal_value(data)

    def create(self, validated_data):
        return MedicalCardService.create_medical_card(**validated_data)

    def update(self, instance, validated_data):
        return MedicalCardService.update_medical_card(instance, **validated_data)
