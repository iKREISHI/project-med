from rest_framework import serializers
from apps.medical_activity.models.diagnosis_category import DiagnosisCategory


class DiagnosisCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DiagnosisCategory
        fields = '__all__'
        read_only_fields = ('id',)

    def to_internal_value(self, data):
        unknown = set(data.keys()) - set(self.fields.keys())
        if unknown:
            errors = {field: ["This field is not allowed."] for field in unknown}
            raise serializers.ValidationError(errors)
        return super().to_internal_value(data)