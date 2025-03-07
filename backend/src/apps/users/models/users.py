from datetime import timedelta
from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, username, password, **extra_fields):
        """
        Creates and saves a User with the given username and password.
        """
        if not username:
            raise ValueError('The given username must be set')
        if not password:
            raise ValueError('The password must be set')
        try:
            validate_password(password, user=None)
        except ValidationError:
            raise ValueError('The given password must be at least 8 characters long')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, password, **extra_fields):
        """
        Create and save a User with the given username and password.
        """
        if not username:
            raise ValueError('The username must be set')
        if not password:
            raise ValueError('The password must be set')
        user = self.model(username=username, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password, **extra_fields):
        """
        Create and save a SuperUser with the given username and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(
        verbose_name='Имя пользователя',
        unique=True,
        max_length=128,
    )
    password = models.CharField(
        verbose_name='Пароль',
        max_length=128,
        error_messages={
            'required': 'Пожалуйста, заполните поле пароля.',
        }
    )
    # Email теперь не используется как основной идентификатор, но может храниться
    email = models.EmailField(
        verbose_name='Почта',
        unique=True,
        blank=True,
        null=True,
        error_messages={
            'required': 'Пожалуйста, заполните поле почты.',
        }
    )
    first_name = models.CharField(
        verbose_name='Имя',
        max_length=100,
        error_messages={
            'required': 'Пожалуйста, заполните поле имени.',
        }
    )
    last_name = models.CharField(
        verbose_name='Фамилия',
        max_length=100,
        error_messages={
            'required': 'Пожалуйста, заполните поле фамилии.',
        }
    )
    patronymic = models.CharField(
        verbose_name='Отчество',
        max_length=100,
        blank=True
    )
    date_joined = models.DateTimeField(
        verbose_name='Дата создания аккаунта',
        default=timezone.now
    )
    is_staff = models.BooleanField(
        _('staff'), default=False
    )
    is_active = models.BooleanField(
        _('active'), default=True
    )
    avatar = models.ImageField(
        verbose_name='Аватар',
        upload_to='avatars/',
        null=True, blank=True
    )

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []  # Дополнительные обязательные поля можно указать здесь

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        """
        Returns the short name for the user.
        """
        return self.first_name
