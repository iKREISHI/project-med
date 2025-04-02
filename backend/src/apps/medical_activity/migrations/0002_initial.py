# Generated by Django 5.1.6 on 2025-04-02 19:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('clients', '0001_initial'),
        ('medical_activity', '0001_initial'),
        ('registry', '0001_initial'),
        ('staffing', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='bookingappointment',
            name='doctor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='staffing.employee', verbose_name='Врач'),
        ),
        migrations.AddField(
            model_name='bookingappointment',
            name='patient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='clients.patient', verbose_name='Пациент'),
        ),
        migrations.AddField(
            model_name='diagnosis',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='medical_activity.diagnosiscategory', verbose_name='Категория'),
        ),
        migrations.AddField(
            model_name='doctorappointment',
            name='assigned_doctor',
            field=models.ForeignKey(blank=True, help_text='Внешний ключ на врача, к которому был записан пациент', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='doctorappointment_assigned', to='staffing.employee', verbose_name='Назначенный врач'),
        ),
        migrations.AddField(
            model_name='doctorappointment',
            name='booking_appointment',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='medical_activity.bookingappointment', verbose_name='Запись на прием'),
        ),
        migrations.AddField(
            model_name='doctorappointment',
            name='diagnosis',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='medical_activity.diagnosis', verbose_name='Диагноз'),
        ),
        migrations.AddField(
            model_name='doctorappointment',
            name='medical_card',
            field=models.ForeignKey(blank=True, max_length=255, null=True, on_delete=django.db.models.deletion.SET_NULL, to='registry.medicalcard'),
        ),
        migrations.AddField(
            model_name='doctorappointment',
            name='patient',
            field=models.ForeignKey(blank=True, help_text='Внешний ключ на пациента направленного на приём', null=True, on_delete=django.db.models.deletion.SET_NULL, to='clients.patient', verbose_name='Пациент'),
        ),
        migrations.AddField(
            model_name='doctorappointment',
            name='signed_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='doctorappointment_signed', to='staffing.employee', verbose_name='Кем подписан'),
        ),
        migrations.AddField(
            model_name='hospitalstays',
            name='appointment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='medical_activity.doctorappointment', verbose_name='Прием'),
        ),
        migrations.AddField(
            model_name='hospitalstays',
            name='patient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='clients.patient', verbose_name='Пациент'),
        ),
        migrations.AddField(
            model_name='patientcondition',
            name='patient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='clients.patient', verbose_name='Пациент'),
        ),
        migrations.AddField(
            model_name='receptiontemplate',
            name='specialization',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='staffing.specialization', verbose_name='Специализация шаблона'),
        ),
        migrations.AddField(
            model_name='patientcondition',
            name='document_template',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='medical_activity.receptiontemplate', verbose_name='Шаблон документа'),
        ),
        migrations.AddField(
            model_name='hospitalstays',
            name='document_template',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='medical_activity.receptiontemplate', verbose_name='Шаблон документа'),
        ),
        migrations.AddField(
            model_name='doctorappointment',
            name='reception_template',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='medical_activity.receptiontemplate', verbose_name='Шаблон приема'),
        ),
        migrations.AddField(
            model_name='shift',
            name='doctor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='staffing.employee', verbose_name='Врач'),
        ),
        migrations.AddField(
            model_name='shift',
            name='document_template',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='medical_activity.receptiontemplate', verbose_name='Шаблон документа'),
        ),
        migrations.AddField(
            model_name='patientcondition',
            name='shift',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='medical_activity.shift', verbose_name='Врачебная смена'),
        ),
        migrations.AddField(
            model_name='shifttransfer',
            name='document_template',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='medical_activity.receptiontemplate', verbose_name='Шаблон документа'),
        ),
        migrations.AddField(
            model_name='shifttransfer',
            name='from_shift',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='shifttransfer_from_set', to='medical_activity.shift', verbose_name='Какая смена передается'),
        ),
        migrations.AddField(
            model_name='shifttransfer',
            name='to_shift',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='shifttransfer_to_set', to='medical_activity.shift', verbose_name='Другая смена'),
        ),
    ]
