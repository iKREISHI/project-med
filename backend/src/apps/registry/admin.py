from django.contrib import admin
from .models import MedicalCard

@admin.register(MedicalCard)
class MedicalCardAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'card_type', 'date_created', 'filial', 'is_signed')
    list_filter = ('card_type', 'date_created', 'is_signed', 'filial')
    search_fields = (
        'client__id',         # При наличии у модели Patient других полей (например, first_name, last_name) можно добавить поиск по ним
        'card_type',
        'comment',
    )
