from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.abstract_models.person.validators import validate_last_name, validate_first_name, validate_patronymic, \
    validate_gender, validate_date_of_birth, validate_snils, validate_phone, validate_address, validate_inn, \
    person_validate_email
from apps.company_structure.models import FilialDepartment
from apps.staffing.models import Employee, Position
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class RegistrationModelSerializer(serializers.ModelSerializer):
    is_django_user = serializers.BooleanField(

    )

    class Meta:
        model = Employee
        fields = (
            'first_name',
            'last_name',
            'patronymic',
            'is_django_user',
            'gender',
            'date_of_birth',
            'snils',
            'inn',
            'registration_address',
            'actual_address',
            'email',
            'phone',
            'department',
            'position',
            'short_description'
        )

        extra_kwargs = {
            'first_name': {'required': True, 'error_messages': {'blank': _('Пожалуйста, напишите имя.')}},
            'last_name': {'required': True, 'error_messages': {'blank': _('Пожалуйста, напишите фамилию.')}},
            'patronymic': {'required': True, 'error_messages': {'blank': _('Пожалуйста, напишите отчество.')}},
            'gender': {'required': True, 'error_messages': {'blank': _('Пожалуйста, укажите пол.')}},
            'is_django_user': {'required': True, 'error_messages':
                {'blank': _('Пожалуйста, укажите может ли пользователь заходить в систему и пользоваться ей')}},
            'date_of_birth': {'error_messages': {'blank': _('Пожалуйста, укажите дату рождения.')}},
            'snils': {'error_messages': {'blank': _('Пожалуйста, укажите СНИЛС.')}},
            'inn': {'error_messages': {'blank': _('Пожалуйста, укажите ИНН.')}},
            'registration_address': {'error_messages': {'blank': _('Пожалуйста, укажите адрес регистрации.')}},
            'actual_address': {'error_messages': {'blank': _('Пожалуйста, укажите фактический адрес.')}},
            'email': {'error_messages': {'blank': _('Пожалуйста, укажите email.')}},
            'phone': {'error_messages': {'blank': _('Пожалуйста, укажите номер телефона.')}},
            'department': {'error_messages': {'blank': _('Пожалуйста, укажите отдел.')}},
            'position': {'error_messages': {'blank': _('Пожалуйста, укажите должность.')}},
            'short_description': {'error_messages': {'blank': _('Пожалуйста, заполните краткое описание.')}},
        }


    def validate(self, data):
        validate_last_name(data.get("last_name"))
        validate_first_name(data.get("first_name"))
        validate_patronymic(data.get("patronymic"))
        validate_gender(data.get("gender"))
        validate_date_of_birth(data.get("date_of_birth"))
        validate_snils(data.get("snils"))
        validate_inn(data.get("inn"))
        validate_phone(data.get("phone"))
        validate_address(data.get("registration_address"))
        validate_address(data.get("actual_address"))
        person_validate_email(data.get("email"))

        if not FilialDepartment.objects.exists():
            raise serializers.ValidationError(_("Не найдено ни одного отдела, создайте хотя бы один."))

        if not Position.objects.exists():
            raise serializers.ValidationError(_("Не найдено ни одной должности, создайте хотя бы одну."))

        return data

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        # create_user = CreateUserService(username, password)
        # return create_user.create_user(**validated_data)