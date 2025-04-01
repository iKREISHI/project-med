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