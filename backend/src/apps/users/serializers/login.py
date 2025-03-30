from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(
        error_messages={'required': _('Пожалуйста, укажите имя пользователя.')}
    )
    password = serializers.CharField(
        write_only=True,
        error_messages={'required': _('Пожалуйста, укажите пароль.')}
    )

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if not username:
            raise ValidationError(
                {'username': _('Пожалуйста, укажите имя пользователя.')}
            )

        if not password:
            raise ValidationError(
                {'password': _('Пожалуйста, укажите пароль.')}
            )

        user = authenticate(username=username, password=password)
        if not user:
            raise ValidationError(
                {'username': _('Неверное имя пользователя или пароль.')}
            )

        data['user'] = user
        return data