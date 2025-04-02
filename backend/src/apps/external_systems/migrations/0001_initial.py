# Generated by Django 5.1.6 on 2025-04-01 17:51

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('clients', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Laboratory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('guid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name='Уникальный идентификатор лаборатории')),
                ('name', models.CharField(max_length=255, verbose_name='Название лаборатории')),
                ('address', models.CharField(max_length=255, verbose_name='Адрес лаборатории')),
            ],
            options={
                'verbose_name': 'Лаборатория',
                'verbose_name_plural': 'Лаборатории',
            },
        ),
        migrations.CreateModel(
            name='Medicine',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('external_id', models.PositiveIntegerField(unique=True, verbose_name='Внешний ID')),
                ('klp_code', models.CharField(max_length=200, verbose_name='Код КЛП')),
                ('smnn_code', models.CharField(max_length=200, verbose_name='Код узла СМНН')),
                ('ktru_code', models.CharField(max_length=200, verbose_name='Код КТРУ')),
                ('name_trade', models.CharField(max_length=255, verbose_name='Торговое наименование')),
                ('standard_inn', models.CharField(max_length=255, verbose_name='Стандартизованное МНН')),
                ('standard_form', models.CharField(max_length=255, verbose_name='Стандартизованная лекарственная форма')),
                ('standard_doze', models.CharField(max_length=50, verbose_name='Стандартизованная лекарственная доза')),
                ('name_producer', models.CharField(max_length=255, verbose_name='Наименование производителя')),
                ('oksm_code', models.IntegerField(verbose_name='Код ОКСМ')),
                ('country', models.CharField(max_length=100, verbose_name='Страна производителя')),
                ('number_registration', models.CharField(max_length=200, verbose_name='Номер регистрационного удостоверения')),
                ('date_registration', models.DateField(help_text='Формат: дд.мм.гггг', verbose_name='Дата регистрационного удостоверения')),
                ('name_unit', models.CharField(max_length=50, verbose_name='Наименование потребительской единицы')),
                ('okei_code', models.IntegerField(verbose_name='Код ОКЕИ')),
                ('normalized_dosage', models.CharField(max_length=50, verbose_name='Нормализованная дозировка')),
                ('normalized_form', models.CharField(max_length=255, verbose_name='Нормализованная форма')),
                ('name_1_packing', models.CharField(max_length=100, verbose_name='Наименование первичной упаковки')),
                ('number_units_1', models.CharField(max_length=50, verbose_name='Количество единиц в первичной упаковке')),
                ('name_2_package', models.CharField(max_length=100, verbose_name='Наименование вторичной упаковки')),
                ('number_packages', models.IntegerField(verbose_name='Количество первичных упаковок во вторичной упаковке')),
                ('number_units_2', models.CharField(max_length=50, verbose_name='Количество единиц во вторичной упаковке')),
                ('okpd_2_code', models.CharField(max_length=100, verbose_name='Код ОКПД 2')),
                ('essential_medicines', models.CharField(max_length=10, verbose_name='ЖНВЛП')),
                ('narcotic_psychotropic', models.CharField(max_length=10, verbose_name='Наличие наркотических/психотропных веществ')),
                ('code_atc', models.CharField(max_length=50, verbose_name='Код АТХ')),
                ('name_atc', models.CharField(max_length=255, verbose_name='Наименование АТХ')),
                ('tn', models.TextField(verbose_name='Наименование ФТГ')),
                ('completeness', models.CharField(max_length=50, verbose_name='Комплектность упаковки')),
            ],
            options={
                'verbose_name': 'Лекарственный препарат',
                'verbose_name_plural': 'Лекарственные препараты',
            },
        ),
        migrations.CreateModel(
            name='LaboratoryResearch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lab_direction_guid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True, verbose_name='GUID направления')),
                ('status', models.CharField(choices=[('completed', 'Завершено'), ('process', 'В процессе')], max_length=20, verbose_name='Статус исследования')),
                ('number', models.CharField(max_length=50, verbose_name='Номер документа')),
                ('create_date', models.DateTimeField(verbose_name='Дата создания')),
                ('direction_date', models.DateTimeField(verbose_name='Дата направления')),
                ('previous_research_guid', models.UUIDField(blank=True, null=True, verbose_name='GUID предыдущего исследования')),
                ('is_previous_research', models.BooleanField(default=False, verbose_name='Предыдущее исследование выполнено')),
                ('is_priority', models.BooleanField(default=False, verbose_name='Приоритетное исследование (CITO)')),
                ('laboratory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='external_systems.laboratory', verbose_name='Лаборатория')),
                ('patient', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='clients.patient', verbose_name='Пациент')),
            ],
            options={
                'verbose_name': 'Лабораторное исследование',
                'verbose_name_plural': 'Лабораторные исследования',
            },
        ),
        migrations.CreateModel(
            name='LaboratoryResearchPDF',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pdf_data', models.BinaryField(verbose_name='PDF-документ')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания документа')),
                ('research', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='pdf_report', to='external_systems.laboratoryresearch', to_field='lab_direction_guid')),
            ],
            options={
                'verbose_name': 'PDF отчет исследования',
                'verbose_name_plural': 'PDF отчеты исследований',
            },
        ),
        migrations.AddIndex(
            model_name='laboratoryresearch',
            index=models.Index(fields=['lab_direction_guid'], name='external_sy_lab_dir_f5c9fc_idx'),
        ),
        migrations.AddIndex(
            model_name='laboratoryresearch',
            index=models.Index(fields=['patient'], name='external_sy_patient_840b96_idx'),
        ),
    ]
