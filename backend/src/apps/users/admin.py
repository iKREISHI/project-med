from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from apps.users.models import User


@admin.register(User)
class CustomUser(UserAdmin):
    list_display = ('username', 'first_name', 'last_name', 'is_active',)
    fieldsets = (
        (None, {'fields': ('username', 'password', 'uuid')}),
        ('Personal info', {'fields': ('email', 'last_name', 'first_name', 'patronymic')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    readonly_fields = ('last_login', 'date_joined', 'uuid')
