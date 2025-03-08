from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from apps.users.validators import (
    validate_username, validate_password,
    validate_last_name, validate_first_name,
    validate_patronymic, validate_email
)

User = get_user_model()


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        label=_("Пароль"),
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        label=_("Подтверждение пароля"),
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = (
            'username', 'password', 'password2',
            'email', 'first_name', 'last_name',
            'patronymic', 'avatar'
        )
        extra_kwargs = {
            'email': {'required': False, 'allow_blank': True},
            'patronymic': {'required': False, 'allow_blank': True},
            'avatar': {'required': False, 'allow_null': True},
        }

    def validate(self, data):
        password = data.get('password')
        password2 = data.pop('password2', None)
        if password != password2:
            raise serializers.ValidationError(
                {'password':  _("Пароли не совпадают.")}
            )
        validate_username(data.get('username'))
        validate_password(password)
        validate_last_name(data.get('last_name'))
        validate_first_name(data.get('first_name'))
        validate_patronymic(data.get('patronymic'))
        validate_email(data.get('email'))

        return data

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
