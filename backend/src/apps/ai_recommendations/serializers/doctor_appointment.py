from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from apps.medical_activity.models import DoctorAppointment, BookingAppointment, ReceptionTemplate, Diagnosis
from apps.clients.models import Patient
from apps.staffing.models import Employee, ReceptionTime
from apps.registry.models import MedicalCard
import json


class AIRecommendationsDoctorAppointmentSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    booking_appointment = serializers.PrimaryKeyRelatedField(
        queryset=BookingAppointment.objects.all(), required=False, allow_null=True
    )
    patient = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(), required=False, allow_null=True
    )
    reception_template = serializers.PrimaryKeyRelatedField(
        queryset=ReceptionTemplate.objects.all()
    )
    reception_document = serializers.CharField(
        required=False, allow_blank=True, allow_null=True
    )
    reception_document_fields = serializers.JSONField(
        required=False, allow_null=True
    )
    assigned_doctor = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(), required=False, allow_null=True
    )
    signed_by = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all()
    )
    is_first_appointment = serializers.BooleanField(default=True)
    is_closed = serializers.BooleanField(default=False)
    reason_for_inspection = serializers.CharField(
        required=False, allow_blank=True, allow_null=True
    )
    inspection_choice = serializers.ChoiceField(
        choices=DoctorAppointment.INSPECTION_CHOICES, default='no_inspection'
    )
    appointment_date = serializers.DateField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
    date_created = serializers.DateTimeField(read_only=True)
    date_updated = serializers.DateTimeField(read_only=True)
    medical_card = serializers.PrimaryKeyRelatedField(
        queryset=MedicalCard.objects.all(), required=False, allow_null=True
    )
    diagnosis = serializers.PrimaryKeyRelatedField(
        queryset=Diagnosis.objects.all(), required=False, allow_null=True
    )

    def validate(self, attrs):
        """
        Валидация времени приёма: проверка, что время записи попадает в рабочие часы врача.
        """
        assigned_doctor = attrs.get('assigned_doctor')
        appointment_date = attrs.get('appointment_date')
        start_time = attrs.get('start_time')
        end_time = attrs.get('end_time')
        if assigned_doctor and appointment_date and start_time and end_time:
            if not ReceptionTime.objects.filter(
                    doctor=assigned_doctor,
                    reception_day=appointment_date,
                    start_time__lte=start_time,
                    end_time__gte=end_time
            ).exists():
                raise serializers.ValidationError({
                    "non_field_errors": _("Время записи не попадает в рабочие часы врача")
                })
        return attrs

    def generate_ai_prompt(self, validated_data):
        """
        Здесь можно добавить логику составления промта для ИИ на основе валидированных данных.
        """
        patient = validated_data.get('patient')
        assigned_doctor = validated_data.get('assigned_doctor')
        appointment_date = validated_data.get('appointment_date')
        start_time = validated_data.get('start_time')
        end_time = validated_data.get('end_time')

        patient_obj = patient
        if not patient_obj:
            raise serializers.ValidationError({"Patient": "пациент не найден"})

        doctor = assigned_doctor
        if not doctor:
            raise serializers.ValidationError({"assigned_doctor": "Врач не найден"})

        json_fields = json.loads(validated_data.get('reception_document_fields'))

        medical_card = validated_data.get('medical_card')
        # if not medical_card:
        #     raise serializers.ValidationError(
        #         {"medical_card": "Мед.карта не найдена"}
        #     )

        diagnosis = validated_data.get('diagnosis')
        if not diagnosis:
            raise serializers.ValidationError({"diagnosis": "Диагноз не найден"})

        # print(json_fields, type(json_fields))
        complaints = json_fields.get('complaints')
        if not complaints:
            raise serializers.ValidationError({"complaints": "Нет жалоб"})

        # история_болезни
        illness_history = json_fields.get('illness_history')
        if not illness_history:
            pass

        # жизненная_история
        life_history = json_fields.get('life_history')
        if not life_history:
            pass

        # объективный_статус
        objective_status = json_fields.get('objective_status')
        if not objective_status:
            pass


        # prompt = (
        #     f"Пациент с ID {patient.id if patient else 'N/A'} записан на прием к доктору с ID "
        #     f"{assigned_doctor.id if assigned_doctor else 'N/A'} на дату {appointment_date} с "
        #     f"временем начала {start_time} и окончанием {end_time}."
        # )
        prompt = (
            f"Пациент: {patient_obj.get_short_name()}, пол - {patient_obj.gender if patient_obj.gender else 'Не определен'}, дата рождение - {patient_obj.date_of_birth if patient_obj.date_of_birth else 'Не определен'};"
            f"Диагноз: {diagnosis.name}; "
            f"Жалобы: {complaints}; "
            f"Анамнез болезни: {illness_history}; "
            f"Анамнез жизни: {life_history if life_history else 'N/A'}; "
            f"Состояние пациента: {objective_status};"
        )
        return prompt


    # def create(self, validated_data):
    #     """
    #     Создание нового объекта DoctorAppointment.
    #     """
    #     return DoctorAppointment.objects.create(**validated_data)
    def create(self, validated_data):
        ai_prompt = self.generate_ai_prompt(validated_data)
        print(ai_prompt)

    def update(self, instance, validated_data):
        """
        Обновление существующего объекта DoctorAppointment.
        """
        # for attr, value in validated_data.items():
        #     setattr(instance, attr, value)
        # instance.save()
        # return instance
        pass
