from rest_framework import serializers
from apps.medical_activity.models import Shift


class ShiftSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()
    shift_str = serializers.SerializerMethodField()
    start_time = serializers.DateTimeField(format='%Y-%m-%d %H:%M')
    end_time = serializers.DateTimeField(format='%Y-%m-%d %H:%M')

    class Meta:
        model = Shift
        fields = [
            'id',
            'doctor',
            'doctor_name',
            'start_time',
            'end_time',
            'shift_str',
            'document_template',
            'document',
            'document_fields'
        ]
        read_only_fields = ['id', 'doctor_name', 'shift_str']

    def get_doctor_name(self, obj) -> str:
        return obj.doctor.get_short_name() if obj.doctor else None

    def get_shift_str(self, obj) -> str:
        return str(obj)

    def to_internal_value(self, data):
        data = data.copy()
        # Удаляем read_only поля, чтобы они не попадали в validated_data
        for field in self.Meta.read_only_fields:
            data.pop(field, None)

        unknown = set(data.keys()) - set(self.fields.keys())
        if unknown:
            errors = {field: ["This field is not allowed."] for field in unknown}
            raise serializers.ValidationError(errors)
        return super().to_internal_value(data)
