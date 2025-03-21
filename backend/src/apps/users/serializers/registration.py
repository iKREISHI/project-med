from django.contrib.auth import get_user_model

from rest_framework import serializers

from apps.abstract_models.person.validators import validate_last_name, validate_first_name, validate_patronymic, \
    validate_gender, validate_date_of_birth, validate_snils, validate_phone, validate_address, validate_inn, \
    person_validate_email
from apps.company_structure.models import FilialDepartment
from apps.staffing.models import Employee, Position
from django.utils.translation import gettext_lazy as _

from apps.users.services.generate_username_by_fio import generate_username_by_fio

User = get_user_model()


class RegistrationModelSerializer(serializers.ModelSerializer):
    is_django_user = serializers.BooleanField(
        write_only=True,
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
            'gender': {'error_messages': {'blank': _('Пожалуйста, укажите пол.')}},
            'is_django_user': {'required': True, 'write_only': True, 'error_messages':
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
        last_name = data.get('last_name')
        first_name = data.get('first_name')
        patronymic = data.get('patronymic')
        inn = data.get('inn')
        snils = data.get('snils')
        email = data.get('email')

        validate_last_name(last_name)
        validate_first_name(first_name)
        validate_patronymic(patronymic)
        validate_gender(data.get("gender"))
        validate_date_of_birth(data.get("date_of_birth"))

        if Employee.objects.filter(snils=snils).exists() and snils:
            raise serializers.ValidationError(str(_("Данный СНИЛС уже используется.")))
        validate_snils(snils)

        if Employee.objects.filter(inn=inn).exists() and inn:
            raise serializers.ValidationError(str(_("Данный ИНН уже используется.")))
        validate_inn(inn)

        validate_phone(data.get("phone"))
        validate_address(data.get("registration_address"))
        validate_address(data.get("actual_address"))

        if email:
            person_validate_email(email)

        if not FilialDepartment.objects.exists() and data.get('department'):
            raise serializers.ValidationError(str(_("Не найдено ни одного отдела, создайте хотя бы один.")))

        if not Position.objects.exists() and data.get('position'):
            raise serializers.ValidationError(str(_("Не найдено ни одной должности, создайте хотя бы одну.")))

        # Проверяем, существует ли пользователь с таким ФИО
        existing_employee = Employee.objects.filter(
            first_name=first_name, last_name=last_name, patronymic=patronymic
        )

        if existing_employee.exists():
            # Если у пользователя не указан ИНН
            if not inn and not snils:
                raise serializers.ValidationError(
                    _("Пользователь с таким ФИО уже существует. Пожалуйста, укажите СНИЛС и ИНН.")
                )

            # Если у найденного пользователя такой же ИНН
            if existing_employee.filter(inn=inn, snils=snils).exists():
                raise serializers.ValidationError(str(_("Пользователь с такими ФИО и ИНН уже существует.")))


        username = generate_username_by_fio(first_name, last_name, patronymic)

        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError(str(_("Пользователь с таким именем уже существует")))

        is_django_user = data.pop('is_django_user')

        password = User.objects.make_random_password()
        user = User.objects.create_user(username=username, password=password, is_active=is_django_user)

        if not user:
            raise serializers.ValidationError(str(_("Ошибка создания пользователя")))

        data['user'] = user
        data['password'] = password

        return data

    def create(self, data):
        last_name = data.pop('last_name')
        first_name = data.pop('first_name')
        patronymic = data.pop('patronymic')
        user = data.pop('user')
        password = data.pop('password')

        employee = Employee.objects.create(
            first_name=first_name,
            last_name=last_name,
            patronymic=patronymic,
            gender=data.get('gender'),
            date_of_birth=data.get('date_of_birth'),
            snils=data.get('snils'),
            inn=data.get('inn'),
            registration_address=data.get('registration_address'),
            actual_address=data.get('actual_address'),
            email=data.get('email'),
            phone=data.get('phone'),
            position=data.get('position'),
            short_description=data.get('short_description'),
            department=data.get('department'),
            user=user
        )

        self.generated_username = user.username
        self.generated_password = password

        return employee

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if hasattr(self, 'generated_username') and hasattr(self, 'generated_password') and self.generated_username and self.generated_password:
            data['user'] = {
                'username': self.generated_username,
                'password': self.generated_password
            }

        return data