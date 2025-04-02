from rest_framework import serializers
from apps.medical_activity.models import HospitalStays


class HospitalStaysSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    appointment_str = serializers.SerializerMethodField()
    hospital_stay_str = serializers.SerializerMethodField()
    start_date = serializers.DateField(format='%Y-%m-%d')
    end_date = serializers.DateField(format='%Y-%m-%d')

    class Meta:
        model = HospitalStays
        fields = [
            'id',
            'patient',
            'patient_name',
            'description',
            'start_date',
            'end_date',
            'ward_number',
            'appointment',
            'appointment_str',
            'hospital_stay_str',
            'document_template',
            'document',
            'document_fields'
        ]
        read_only_fields = ['id', 'patient_name', 'appointment_str', 'hospital_stay_str']

    def get_patient_name(self, obj):
        return obj.patient.get_short_name() if obj.patient else None

    def get_appointment_str(self, obj):
        return str(obj.appointment) if obj.appointment else None

    def get_hospital_stay_str(self, obj):
        return str(obj)
