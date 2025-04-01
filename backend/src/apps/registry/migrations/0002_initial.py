# Generated by Django 5.1.6 on 2025-04-01 17:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('registry', '0001_initial'),
        ('staffing', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='medicalcard',
            name='signed_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='staffing.employee', verbose_name='Кем подписан'),
        ),
        migrations.AddField(
            model_name='medicalcard',
            name='card_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='medical_card_types', to='registry.medicalcardtype', verbose_name='Тип карты'),
        ),
    ]
