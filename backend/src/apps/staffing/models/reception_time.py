from django.db import models
from django.utils.translation import gettext_lazy as _


class ReceptionTime(models.Model):
    doctor = models.ForeignKey(
        'staffing.Employee',
        on_delete=models.CASCADE,
        verbose_name=_("Врач"),
        related_name="reception_times"
    )
    reception_day = models.DateField(
        verbose_name=_("День приёма"),
        help_text=_("Укажите дату приёма (YYYY-MM-DD)")
    )
    start_time = models.TimeField(
        verbose_name=_("Время начала"),
        help_text=_("Время начала рабочего периода")
    )
    end_time = models.TimeField(
        verbose_name=_("Время окончания"),
        help_text=_("Время окончания рабочего периода")
    )

    class Meta:
        verbose_name = _("Время приёма")
        verbose_name_plural = _("Время приёма")
        ordering = ['doctor', 'reception_day', 'start_time']


    def __str__(self):
        return f"{self.doctor} - {self.reception_day}: {self.start_time} - {self.end_time}"