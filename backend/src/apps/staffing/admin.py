from django.contrib import admin
from .models import Position, Employee, Specialization, ReceptionTime


@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'short_name', 'minzdrav_position')
    search_fields = ('name', 'short_name', 'minzdrav_position')
    ordering = ('name',)
    readonly_fields = ('id',)


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_full_name', 'department', 'position', 'appointment_duration')
    search_fields = ('department', 'position__name', 'first_name', 'last_name', 'short_description')
    list_filter = ('department', 'position')
    ordering = ('department', 'position')
    readonly_fields = ('id',)


@admin.register(ReceptionTime)
class ReceptionTimeAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'reception_day', 'start_time', 'end_time')
    search_fields = ('doctor', 'reception_day')
    list_filter = ('doctor', 'reception_day')
    ordering = ('doctor', 'reception_day')
    readonly_fields = ('id',)


@admin.register(Specialization)
class SpecializationAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description')
    search_fields = ('title', )
    list_filter = ('title',)
    ordering = ('title',)
    readonly_fields = ('id',)
