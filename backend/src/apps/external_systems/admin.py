from django.contrib import admin
from .models import Laboratory, LaboratoryResearch, LaboratoryResearchPDF
from .models import Medicine


@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = [
        'external_id',
        'name_trade',
        'standard_inn',
        'name_producer',
        'date_registration'
    ]
    search_fields = ['name_trade', 'standard_inn', 'name_producer']
    list_filter = ['country', 'date_registration', 'name_producer',]



@admin.register(Laboratory)
class LaboratoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'guid')
    search_fields = ('name', 'address')
    readonly_fields = ('guid',)

@admin.register(LaboratoryResearch)
class LaboratoryResearchAdmin(admin.ModelAdmin):
    list_display = ('number', 'status', 'create_date', 'direction_date', 'patient', 'laboratory', 'is_priority')
    list_filter = ('status', 'is_priority', 'laboratory')
    search_fields = ('number', 'lab_direction_guid', 'patient__name')
    readonly_fields = ('lab_direction_guid',)
    date_hierarchy = 'create_date'

@admin.register(LaboratoryResearchPDF)
class LaboratoryResearchPDFAdmin(admin.ModelAdmin):
    list_display = ('research', 'created_at')
    readonly_fields = ('pdf_data',)


from django.contrib import admin
from django.utils.html import format_html
from apps.external_systems.models import Prescription


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    """
    Административный интерфейс для модели рецептов.
    """
    list_display = ('id', 'document_number', 'patient', 'is_signed', 'is_send', 'date_created', 'signed_by', 'doc_content')
    list_filter = ('is_signed', 'is_send', 'date_created')
    search_fields = ('document_number', 'patient__last_name', 'patient__first_name')
    readonly_fields = ('id', 'document_number', 'system', 'date_created', 'signed_by', 'is_signed', 'org_signature')
    ordering = ('-date_created',)


    fieldsets = (
        ("Основная информация", {
            'fields': ('id', 'document_number', 'system', 'patient', 'description', 'is_send', 'date_created')
        }),
        ("Электронная подпись", {
            'fields': ('is_signed', 'signed_by', 'org_signature')
        }),
        ("Содержимое рецепта", {
            'fields': ('doc_content',),
        }),
    )
