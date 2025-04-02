# Generated by Django 5.1.6 on 2025-03-21 08:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('medical_activity', '0003_remove_doctorappointment_uuid'),
    ]

    operations = [
        migrations.AddField(
            model_name='doctorappointment',
            name='appointment_date',
            field=models.DateField(default=None, help_text='Укажите дату приема (YYYY-MM-DD)', verbose_name='Дата приема'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='doctorappointment',
            name='end_time',
            field=models.TimeField(default=None, help_text='Время окончания приема', verbose_name='Время окончания приема'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='doctorappointment',
            name='start_time',
            field=models.TimeField(default=None, help_text='Время начала приема', verbose_name='Время начала приема'),
            preserve_default=False,
        ),
    ]
