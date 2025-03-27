from rest_framework import serializers
from .models import AbstractPersonModel

class AbstractPersonSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = AbstractPersonModel
        fields = [
            'id',
            'last_name',
            'first_name',
            'patronymic',
            'gender',
            'date_of_birth',
            'date_created',
            'snils',
            'inn',
            'photo',
            'registration_address',
            'actual_address',
            'email',
            'phone',
            'full_name',
        ]
        read_only_fields = ['date_created', 'full_name']

    def get_full_name(self, obj):
        return obj.get_full_name()
