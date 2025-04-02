from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from apps.external_systems.models import Prescription


class PrescriptionModelSerializer(ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'
        lookup_field = 'id'
        read_only_fields = ('id', 'date_created', 'document_number', 'system', 'org_signature')

    def to_internal_value(self, data):
        unknown = set(data.keys()) - set(self.fields.keys())
        if unknown:
            errors = {field: ["This field is not allowed."] for field in unknown}
            raise serializers.ValidationError(errors)
        return super().to_internal_value(data)

    def validate(self, attrs):
        errors = {}

        # Проверка обязательности пациента
        if 'patient' not in attrs or attrs['patient'] is None:
            errors['patient'] = ["Пациент обязателен для рецепта."]

        # Проверка длины doc_content
        if 'doc_content' in attrs and attrs['doc_content']:
            if len(attrs['doc_content']) > 50000:
                errors['doc_content'] = ["Содержимое документа слишком длинное. Максимальная длина 50000 символов."]

        # Проверка: если рецепт отправлен, он должен быть подписан
        if 'is_send' in attrs and attrs['is_send'] and not attrs.get('is_signed', False):
            errors['is_send'] = ["Рецепт нельзя отправить, если он не подписан."]

        if errors:
            raise serializers.ValidationError(errors)

        return attrs
