from rest_framework import serializers
from apps.staffing.models.position import Position
from apps.staffing.services import PositionService


class StrictCharField(serializers.CharField):
    def to_internal_value(self, data):
        if not isinstance(data, str):
            raise serializers.ValidationError("This field must be a string.")
        return super().to_internal_value(data)


class PositionSerializer(serializers.ModelSerializer):
    # Используем кастомное поле для текстовых значений, если нужно обеспечить, что значение является строкой.
    name = StrictCharField()
    short_name = StrictCharField(allow_blank=True, allow_null=True, required=False)
    minzdrav_position = StrictCharField(allow_blank=True, allow_null=True, required=False)

    class Meta:
        model = Position
        fields = '__all__'
        read_only_fields = ('id',)

    def to_internal_value(self, data):
        # Если переданы неизвестные ключи, выбрасываем ошибку
        unknown = set(data.keys()) - set(self.fields.keys())
        if unknown:
            errors = {field: ["This field is not allowed."] for field in unknown}
            raise serializers.ValidationError(errors)
        return super().to_internal_value(data)

    def create(self, validated_data):
        return PositionService.create_position(**validated_data)


    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.full_clean()
        instance.save()
        return instance
