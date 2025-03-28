from rest_framework import serializers
from apps.medical_activity.models import BookingAppointment

class BookingAppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    booking_str = serializers.SerializerMethodField()
    vizit_datetime = serializers.DateTimeField(format='%Y-%m-%d %H:%M')

    class Meta:
        model = BookingAppointment
        fields = [
            'id',
            'patient',
            'patient_name',
            'doctor',
            'doctor_name',
            'status',
            'vizit_datetime',
            'created_at',
            'updated_at',
            'booking_str'
        ]
        read_only_fields = ['id', 'patient_name', 'doctor_name', 'created_at', 'updated_at', 'booking_str']

    def get_patient_name(self, obj) -> str:
        return obj.patient.get_short_name() if obj.patient else None

    def get_doctor_name(self, obj) -> str:
        return obj.doctor.get_short_name() if obj.doctor else None

    def get_booking_str(self, obj) -> str:
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