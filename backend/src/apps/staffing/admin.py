from django.contrib import admin
from .models import Position, Employee


@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ('id', 'uuid', 'name', 'short_name', 'minzdrav_position')
    search_fields = ('name', 'short_name', 'minzdrav_position')
    ordering = ('name',)
    readonly_fields = ('uuid',)


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('id', 'uuid', 'get_full_name', 'department', 'position', 'appointment_duration')
    search_fields = ('department', 'position__name', 'first_name', 'last_name', 'short_description')
    list_filter = ('department', 'position')
    ordering = ('department', 'position')
    readonly_fields = ('uuid',)
