# Generated by Django 5.1.6 on 2025-03-07 10:48

import apps.users.models.users
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(max_length=128, unique=True, verbose_name='Имя пользователя')),
                ('password', models.CharField(error_messages={'required': 'Пожалуйста, заполните поле пароля.'}, max_length=128, verbose_name='Пароль')),
                ('email', models.EmailField(blank=True, error_messages={'required': 'Пожалуйста, заполните поле почты.'}, max_length=254, null=True, unique=True, verbose_name='Почта')),
                ('first_name', models.CharField(error_messages={'required': 'Пожалуйста, заполните поле имени.'}, max_length=100, verbose_name='Имя')),
                ('last_name', models.CharField(error_messages={'required': 'Пожалуйста, заполните поле фамилии.'}, max_length=100, verbose_name='Фамилия')),
                ('patronymic', models.CharField(blank=True, max_length=100, verbose_name='Отчество')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Дата создания аккаунта')),
                ('is_staff', models.BooleanField(default=False, verbose_name='staff')),
                ('is_active', models.BooleanField(default=True, verbose_name='active')),
                ('avatar', models.ImageField(blank=True, null=True, upload_to='avatars/', verbose_name='Аватар')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
            },
            managers=[
                ('objects', apps.users.models.users.UserManager()),
            ],
        ),
    ]
