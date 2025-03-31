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



from enum import Enum
from pydantic import BaseModel, UUID4
from typing import List, Optional

# Модели для аутентификации
class AuthResponse(BaseModel):
    errorCode: int
    sessionId: Optional[str] = None
    error: Optional[str] = None

# Модели пациентов
class Patient(BaseModel):
    firstName: str
    middleName: str
    lastName: str
    birthDate: str  # Можно заменить на datetime при наличии формата
    localId: str    # UUID в строковом представлении
    snils: str
    oms: str

class PatientsResponse(BaseModel):
    patients: List[Patient]

# Модели для лабораторных исследований
class ResearchStatus(str, Enum):
    COMPLETED = "completed"
    PROCESS = "process"

class Laboratory(BaseModel):
    guid: UUID4
    address: str
    name: str
    id: Optional[int] = None  # Опционально, так как в примере есть id=0

class LabResearchInfo(BaseModel):
    status: ResearchStatus
    id: int
    labDirectionGuid: UUID4
    number: str
    createDate: str            # datetime в формате ISO
    directionDate: str         # datetime в формате ISO
    previousResearchResultsGuid: Optional[UUID4] = None
    isPreviousResearchPerformed: bool
    isPriority: bool
    patientLocalId: str
    laboratory: Laboratory

class LabResearchResponse(BaseModel):
    researches: List[LabResearchInfo]

# Модель для конкретного исследования
class SingleLabResearchResponse(LabResearchInfo):
    pass  # Наследуем все поля от LabResearchInfo

# Модель для PDF-документа
class LabResearchPDF(BaseModel):
    labDirectionGuid: UUID4
    createDate: str
    pdf: str  # Base64-encoded PDF

# Модели ошибок
class ErrorResponse(BaseModel):
    errorCode: Optional[int] = None
    error: Optional[str] = None