from rest_framework import serializers
from apps.medical_activity.models import PatientCondition, ReceptionTemplate, Shift
from apps.clients.models import Patient
import json
from utils.json_decode import extract_fields, dict_to_str


class AIRecommendationPatientConditionSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)

    # Поля, унаследованные от AbstractDocumentTemplate
    document_template = serializers.PrimaryKeyRelatedField(
        queryset=ReceptionTemplate.objects.all(),
        required=False,
        allow_null=True
    )
    document = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True
    )
    document_fields = serializers.JSONField(
        required=False,
        allow_null=True
    )

    # Специфичные для PatientCondition поля
    patient = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all()
    )
    shift = serializers.PrimaryKeyRelatedField(
        queryset=Shift.objects.all()
    )
    description = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True
    )
    date = serializers.DateTimeField(read_only=True)
    status = serializers.ChoiceField(
        choices=list(PatientCondition.STATUS_CHOICES.items())
    )

    def generate_ai_prompt(self, validated_data):
        json_fields = json.loads(validated_data['document_fields']) if 'document_fields' in validated_data else {}

        patient = validated_data['patient']
        if not patient:
            raise serializers.ValidationError({"patient": "Данные пациента не были найдены"})

        shift = validated_data['shift']
        if not shift:
            raise serializers.ValidationError({"shift": "Данные дежурства не были найдены"})

        description = validated_data['description']

        status = validated_data['status']

        # visitStatus – статус
        # визита("ожидает осмотра", "осмотрен", "требуется консилиум")
        #
        # temperature – температура тела
        #
        # bloodPressure – артериальное давление(например, "120/80")
        #
        # pulse – пульс
        #
        # respirationRate – частота дыхания
        #
        # consciousnessLevel – уровень сознания("ясное", "спутанное", "кома")
        #
        # painLevel – уровень боли(по шкале  0 - 10)
        #
        # symptoms – текущие
        # симптомы(кашель, слабость и  т.д.)
        #
        # procedures – процедуры(капельницы, перевязки и  т.д.)
        #
        # diet – диета(стол №X)
        #
        # additionalTests – дополнительные анализы / исследования

        json_datas = extract_fields(json_fields)
        prompt = (
            f"{patient.get_short_name()}, пол - {patient.gender if patient.gender else 'N/A'}, дата рождения - {patient.date_of_birth if patient.date_of_birth else 'N/A'}; "
            f"Статус осмотра: {status}; "
            f"Осмотрен доктором: {shift.doctor if shift.doctor else 'N/A'}; "
            f"Данные обхода: {dict_to_str(json_datas)}; "
        )

        return prompt


    def create(self, validated_data):
        ai_prompt = self.generate_ai_prompt(validated_data)
        print(ai_prompt)

    def update(self, instance, validated_data):
        pass
