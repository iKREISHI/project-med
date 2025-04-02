from django.db import models


class Medicine(models.Model):
    external_id = models.PositiveIntegerField(unique=True, verbose_name="Внешний ID")

    klp_code = models.CharField(max_length=200, verbose_name="Код КЛП")
    smnn_code = models.CharField(max_length=200, verbose_name="Код узла СМНН")
    ktru_code = models.CharField(max_length=200, verbose_name="Код КТРУ")

    name_trade = models.CharField(max_length=255, verbose_name="Торговое наименование")
    standard_inn = models.CharField(max_length=255, verbose_name="Стандартизованное МНН")
    standard_form = models.CharField(max_length=255, verbose_name="Стандартизованная лекарственная форма")
    standard_doze = models.CharField(max_length=50, verbose_name="Стандартизованная лекарственная доза")
    name_producer = models.CharField(max_length=255, verbose_name="Наименование производителя")

    oksm_code = models.IntegerField(verbose_name="Код ОКСМ")
    country = models.CharField(max_length=100, verbose_name="Страна производителя")
    number_registration = models.CharField(max_length=200, verbose_name="Номер регистрационного удостоверения")

    date_registration = models.DateField(verbose_name="Дата регистрационного удостоверения",
                                         help_text="Формат: дд.мм.гггг")

    name_unit = models.CharField(max_length=50, verbose_name="Наименование потребительской единицы")
    okei_code = models.IntegerField(verbose_name="Код ОКЕИ")
    normalized_dosage = models.CharField(max_length=50, verbose_name="Нормализованная дозировка")
    normalized_form = models.CharField(max_length=255, verbose_name="Нормализованная форма")
    name_1_packing = models.CharField(max_length=100, verbose_name="Наименование первичной упаковки")
    number_units_1 = models.CharField(max_length=50, verbose_name="Количество единиц в первичной упаковке")
    name_2_package = models.CharField(max_length=100, verbose_name="Наименование вторичной упаковки")
    number_packages = models.IntegerField(verbose_name="Количество первичных упаковок во вторичной упаковке")
    number_units_2 = models.CharField(max_length=50, verbose_name="Количество единиц во вторичной упаковке")

    okpd_2_code = models.CharField(max_length=100, verbose_name="Код ОКПД 2")
    essential_medicines = models.CharField(max_length=10, verbose_name="ЖНВЛП")  # Например: "Да" или "Нет"
    narcotic_psychotropic = models.CharField(max_length=10,
                                             verbose_name="Наличие наркотических/психотропных веществ")  # "Да" или "Нет"
    code_atc = models.CharField(max_length=50, verbose_name="Код АТХ")
    name_atc = models.CharField(max_length=255, verbose_name="Наименование АТХ")
    tn = models.TextField(verbose_name="Наименование ФТГ")
    completeness = models.CharField(max_length=50, verbose_name="Комплектность упаковки")

    def __str__(self):
        return self.name_trade

    class Meta:
        verbose_name = "Лекарственный препарат"
        verbose_name_plural = "Лекарственные препараты"