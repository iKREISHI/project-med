from rest_framework import serializers
from apps.registry.models.medical_card import MedicalCard


class StrictCharField(serializers.CharField):
    def to_internal_value(self, data):
        if not isinstance(data, str):
            raise serializers.ValidationError("This field must be a string.")
        return super().to_internal_value(data)


class MedicalCardSerializer(serializers.ModelSerializer):
    # card_type = StrictCharField()  # ожидается строковое значение, которое будет использовано для поиска типа карты

    class Meta:
        model = MedicalCard
        fields = '__all__'
        read_only_fields = ('id', 'date_created',)
        extra_kwargs = {
            "number": {"required": False, "allow_blank": True},
        }

    def to_internal_value(self, data):
        # Проверяем, что в data не переданы неизвестные ключи
        unknown = set(data.keys()) - set(self.fields.keys())
        if unknown:
            errors = {field: ["This field is not allowed."] for field in unknown}
            raise serializers.ValidationError(errors)
        return super().to_internal_value(data)

    def create(self, validated_data):
        # Обращаемся к базе напрямую для создания объекта
        instance = MedicalCard.objects.create(**validated_data)
        return instance

    def update(self, instance, validated_data):
        # Обновляем поля напрямую
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.full_clean()
        instance.save()
        return instance
