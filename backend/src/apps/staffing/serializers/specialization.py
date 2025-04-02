from ..models import Specialization
from rest_framework import serializers


class SpecializationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Specialization
        fields = '__all__'
        read_only_fields = ('id',)

    def to_internal_value(self, data):
        # Если в data присутствуют ключи, которых нет в описании сериализатора – выбрасываем ошибку.
        unknown = set(data.keys()) - set(self.fields.keys())
        if unknown:
            errors = {field: ["This field is not allowed."] for field in unknown}
            raise serializers.ValidationError(errors)
        return super().to_internal_value(data)

