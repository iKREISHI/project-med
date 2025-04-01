from django.contrib import admin
from .models import DoctorAppointment, Shift
from django.utils.translation import gettext_lazy as _
from .models import ShiftTransfer

@admin.register(DoctorAppointment)
class DoctorAppointmentAdmin(admin.ModelAdmin):

    list_display = (
        'patient',
        'assigned_doctor',
        'date_created',
        'inspection_choice',
        'is_closed',
        'is_signed',
        'appointment_date',
        'start_time',
        'end_time',
    )
    list_filter = (
        'is_closed',
        'inspection_choice',
        'is_first_appointment',
        'is_signed',
        'date_created',
    )
    search_fields = (
        'patient__id',          # При наличии у модели Patient соответствующих полей можно заменить на 'patient__first_name', 'patient__last_name'
        'assigned_doctor__id',    # Аналогично для модели Employee
        'reason_for_inspection',
    )


@admin.register(Shift)
class ShiftAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'formatted_start', 'formatted_end')
    list_filter = ('doctor', 'start_time')
    search_fields = ('doctor__last_name', 'doctor__first_name')
    date_hierarchy = 'start_time'
    ordering = ('-start_time',)

    fieldsets = (
        (_('Основная информация'), {
            'fields': (
                'doctor',
                ('start_time', 'end_time'),
            )
        }),
    )

    def formatted_start(self, obj):
        return obj.start_time.strftime('%d.%m.%Y %H:%M')

    formatted_start.short_description = _('Начало смены')
    formatted_start.admin_order_field = 'start_time'

    def formatted_end(self, obj):
        return obj.end_time.strftime('%d.%m.%Y %H:%M')

    formatted_end.short_description = _('Окончание смены')
    formatted_end.admin_order_field = 'end_time'

    def get_readonly_fields(self, request, obj=None):
        if obj:  # При редактировании делаем системные поля только для чтения
            return ('date_created', 'date_modified')
        return ()




@admin.register(ShiftTransfer)
class ShiftTransferAdmin(admin.ModelAdmin):
    list_display = (
        'formatted_from_shift',
        'formatted_to_shift',
        'transfer_date',
        'short_comment',
        'date'
    )
    list_filter = ('date', 'from_shift', 'to_shift')
    search_fields = (
        'comment',
        'from_shift__doctor__last_name',
        'to_shift__doctor__last_name'
    )
    date_hierarchy = 'date'
    ordering = ('-date',)
    raw_id_fields = ('from_shift', 'to_shift')

    fieldsets = (
        (_('Основные данные'), {
            'fields': (
                ('from_shift', 'to_shift'),
                'comment'
            )
        }),
    )

    def formatted_from_shift(self, obj):
        return f"{obj.from_shift.doctor} ({obj.from_shift.start_time:%d.%m.%Y %H:%M})"
    formatted_from_shift.short_description = _('Из смены')
    formatted_from_shift.admin_order_field = 'from_shift'

    def formatted_to_shift(self, obj):
        return f"{obj.to_shift.doctor} ({obj.to_shift.start_time:%d.%m.%Y %H:%M})"
    formatted_to_shift.short_description = _('В смену')
    formatted_to_shift.admin_order_field = 'to_shift'

    def transfer_date(self, obj):
        return obj.date.strftime('%d.%m.%Y %H:%M')
    transfer_date.short_description = _('Дата передачи')
    transfer_date.admin_order_field = 'date'

    def short_comment(self, obj):
        return obj.comment[:50] + '...' if obj.comment else '-'
    short_comment.short_description = _('Комментарий')

    def save_model(self, request, obj, form, change):
        # Добавляем дополнительную проверку при сохранении через админку
        if obj.from_shift_id == obj.to_shift_id:
            from django.contrib import messages
            messages.error(request, _('Нельзя передавать смену самой себе!'))
            return

        super().save_model(request, obj, form, change)