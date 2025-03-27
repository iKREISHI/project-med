from django.contrib import admin
from .models import Filial, FilialDepartment

@admin.register(Filial)
class FilialAdmin(admin.ModelAdmin):
    list_display = ('city', 'street', 'house', 'building')
    search_fields = ('city', 'street', 'house')

@admin.register(FilialDepartment)
class FilialDepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'director', 'filial')
    search_fields = ('name',)
