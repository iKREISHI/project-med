# Generated by Django 5.1.6 on 2025-04-02 19:07

import apps.abstract_models.person.validators
import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('company_structure', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Position',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Наименование должности')),
                ('short_name', models.CharField(blank=True, max_length=100, null=True, verbose_name='Наименование сокращённое')),
                ('minzdrav_position', models.CharField(blank=True, max_length=255, null=True, verbose_name='Должность Минздрава')),
            ],
            options={
                'verbose_name': 'Должность',
                'verbose_name_plural': 'Должности',
            },
        ),
        migrations.CreateModel(
            name='ReceptionTime',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reception_day', models.DateField(help_text='Укажите дату приёма (YYYY-MM-DD)', verbose_name='День приёма')),
                ('start_time', models.TimeField(help_text='Время начала рабочего периода', verbose_name='Время начала')),
                ('end_time', models.TimeField(help_text='Время окончания рабочего периода', verbose_name='Время окончания')),
            ],
            options={
                'verbose_name': 'Время приёма',
                'verbose_name_plural': 'Время приёма',
                'ordering': ['doctor', 'reception_day', 'start_time'],
            },
        ),
        migrations.CreateModel(
            name='Specialization',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, verbose_name='Название специализации')),
                ('description', models.TextField(blank=True, null=True, verbose_name='Описание специализации')),
            ],
            options={
                'verbose_name': 'Специализация врача',
                'verbose_name_plural': 'Специализации врачей',
            },
        ),
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_name', models.CharField(max_length=150, validators=[apps.abstract_models.person.validators.validate_last_name], verbose_name='Фамилия')),
                ('first_name', models.CharField(max_length=150, validators=[apps.abstract_models.person.validators.validate_first_name], verbose_name='Имя')),
                ('patronymic', models.CharField(blank=True, max_length=150, null=True, validators=[apps.abstract_models.person.validators.validate_patronymic], verbose_name='Отчество')),
                ('gender', models.CharField(choices=[('M', 'Мужской'), ('F', 'Женский'), ('U', 'Не указан')], default='U', max_length=1, validators=[apps.abstract_models.person.validators.validate_gender], verbose_name='Пол')),
                ('date_of_birth', models.DateField(blank=True, null=True, validators=[apps.abstract_models.person.validators.validate_date_of_birth], verbose_name='Дата рождения')),
                ('date_created', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('snils', models.CharField(blank=True, help_text='Укажите СНИЛС в формате 123-456-789 01 или 12345678901', max_length=14, null=True, validators=[apps.abstract_models.person.validators.validate_snils], verbose_name='СНИЛС')),
                ('inn', models.CharField(blank=True, max_length=12, null=True, validators=[apps.abstract_models.person.validators.validate_inn], verbose_name='ИНН')),
                ('passport_series', models.CharField(blank=True, max_length=4, null=True, validators=[django.core.validators.RegexValidator(message='Серия паспорта должна состоять ровно из 4 цифр', regex='^\\d{4}$')], verbose_name='Серия паспорта')),
                ('passport_number', models.CharField(blank=True, max_length=6, null=True, validators=[django.core.validators.RegexValidator(message='Номер паспорта должен состоять ровно из 6 цифр', regex='^\\d{6}$')], verbose_name='Номер паспорта')),
                ('photo', models.ImageField(blank=True, null=True, upload_to='photos/', validators=[apps.abstract_models.person.validators.validate_photo_size], verbose_name='Фото')),
                ('registration_address', models.CharField(blank=True, max_length=255, null=True, validators=[apps.abstract_models.person.validators.validate_address], verbose_name='Адрес регистрации')),
                ('actual_address', models.CharField(blank=True, max_length=255, null=True, validators=[apps.abstract_models.person.validators.validate_address], verbose_name='Адрес фактического проживания')),
                ('email', models.EmailField(blank=True, max_length=254, null=True, verbose_name='Почта')),
                ('phone', models.CharField(blank=True, max_length=20, null=True, validators=[apps.abstract_models.person.validators.validate_phone], verbose_name='Номер телефона')),
                ('appointment_duration', models.DurationField(blank=True, null=True, verbose_name='Длительность приёма')),
                ('short_description', models.TextField(blank=True, null=True, verbose_name='Краткое описание')),
                ('telegram_chat_id', models.CharField(blank=True, max_length=255, null=True, verbose_name='Чат ID телеграмма для отправки уведомлений')),
                ('department', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='company_structure.filialdepartment', verbose_name='Подразделение')),
            ],
            options={
                'verbose_name': 'Сотрудник',
                'verbose_name_plural': 'Сотрудники',
            },
        ),
    ]
