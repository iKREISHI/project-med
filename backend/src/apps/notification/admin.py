from django.contrib import admin
from apps.notification.models import Notification
from apps.notification.models import TelegramUser


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'message', 'status', 'date_created', 'date_delivered')
    list_filter = ('status', 'date_created', 'date_delivered')
    search_fields = ('user__username', 'message')
    ordering = ('-date_created',)


@admin.register(TelegramUser)
class TelegramUserAdmin(admin.ModelAdmin):
    list_display = ('chat_id', 'username', 'first_name', 'last_name', 'joined_at')
    search_fields = ('chat_id', 'username', 'first_name', 'last_name')
    ordering = ('-joined_at',)
