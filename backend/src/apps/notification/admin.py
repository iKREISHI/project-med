from django.contrib import admin
from apps.notification.models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'message', 'status', 'date_created', 'date_delivered')
    list_filter = ('status', 'date_created', 'date_delivered')
    search_fields = ('user__username', 'message')
    ordering = ('-date_created',)
