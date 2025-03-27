from django.contrib import admin
from .models import Contractor, Patient

@admin.register(Contractor)
class ContractorAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'full_name',
        'inn',
        'kpp',
        'bank_account',
        'ownership_form',
        'insurance_organization',
    )
    search_fields = ('full_name', 'inn', 'kpp')
    list_filter = ('ownership_form', 'insurance_organization')


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'last_name',
        'first_name',
        'patronymic',
        'gender',
        'date_of_birth',
        'contractor',
        'registered_by',
    )
    search_fields = (
        'last_name',
        'first_name',
        'patronymic',
        'snils',
        'inn',
        'email',
        'phone',
    )
    list_filter = ('gender', 'contractor', 'registered_by')
