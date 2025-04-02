from rest_framework import serializers
from apps.medical_activity.models import PatientCondition


class PatientConditionSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    shift_str = serializers.SerializerMethodField()
    condition_str = serializers.SerializerMethodField()
    date = serializers.DateTimeField(format='%Y-%m-%d %H:%M', read_only=True)

    class Meta:
        model = PatientCondition
        fields = [
            'id',
            'patient',
            'patient_name',
            'shift',
            'shift_str',
            'description',
            'date',
            'status',
            'condition_str',
            'document_template',
            'document',
            'document_fields'
        ]
        read_only_fields = ['id', 'patient_name', 'shift_str', 'date', 'condition_str']

    def get_patient_name(self, obj):
        return obj.patient.get_short_name() if obj.patient else None

    def get_shift_str(self, obj):
        return str(obj.shift) if obj.shift else None

    def get_condition_str(self, obj):
        return str(obj)
