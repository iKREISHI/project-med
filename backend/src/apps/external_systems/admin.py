from django.contrib import admin

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