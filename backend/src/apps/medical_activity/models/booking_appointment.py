from django.db import models
from apps import clients, staffing


class BookingAppointment(models.Model):
    """
    Модель для записи на приём (запланированные визиты)
    """
    patient = models.ForeignKey(
        'clients.Patient',
        on_delete=models.PROTECT,
        verbose_name='Пациент'
    )

    doctor = models.ForeignKey(
        'staffing.Employee',
        on_delete=models.PROTECT,
        verbose_name='Врач'
    )

    STATUS_CHOICES = {
        'planning': 'планирование',
        'confirmation': 'подтверждение',
        'отмена': 'cancellation'
    }

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES.items(),
        verbose_name='Статус'
    )

    vizit_datetime = models.DateTimeField(
        verbose_name='Дата записи'
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления'
    )

    class Meta:
        verbose_name = 'Запись на прием'
        verbose_name_plural = 'Записи на прием'

    def __str__(self) -> str:
        patient = self.patient.get_short_name()
        doctor = self.doctor.get_short_name()
        date = self.vizit_datetime.strftime('%Y-%m-%d %H:%M')
        return f'{patient} - {doctor} - {date}'