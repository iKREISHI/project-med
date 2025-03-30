from rest_framework import serializers
from apps.medical_activity.models import DoctorAppointment
from apps.medical_activity.service import DoctorAppointmentService


class StrictCharField(serializers.CharField):
    def to_internal_value(self, data):
        if not isinstance(data, str):
            raise serializers.ValidationError("This field must be a string.")
        return super().to_internal_value(data)


class DoctorAppointmentSerializer(serializers.ModelSerializer):
    reason_for_inspection = StrictCharField(allow_blank=True, allow_null=True, required=False)

    class Meta:
        model = DoctorAppointment
        fields = '__all__'
        read_only_fields = ('id', 'date_created',)

    def to_internal_value(self, data):
        unknown = set(data.keys()) - set(self.fields.keys())
        if unknown:
            errors = {field: ["This field is not allowed."] for field in unknown}
            raise serializers.ValidationError(errors)
        return super().to_internal_value(data)

    def create(self, validated_data):
        return DoctorAppointmentService.create_appointment(**validated_data)

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.full_clean()
        instance.save()
        return instance
