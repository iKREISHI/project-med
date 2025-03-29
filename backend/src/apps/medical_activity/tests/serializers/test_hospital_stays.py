import datetime
from django.test import TestCase
from unittest.mock import patch

from django.utils import timezone

from apps.medical_activity.models import HospitalStays, DoctorAppointment, ReceptionTemplate
from apps.medical_activity.serializers import HospitalStaysSerializer
from apps.clients.models import Patient
from apps.staffing.models import Employee, Specialization, ReceptionTime


class HospitalStaysSerializerTestCase(TestCase):
    def setUp(self):
        # Создаем тестового пациента и задаем его метод get_short_name
        self.patient = Patient.objects.create()
        self.patient.get_short_name = lambda: "John Doe"

        # Создаем тестового сотрудника, который будет использоваться для поля signed_by у DoctorAppointment
        self.employee = Employee.objects.create()

        # Создаем тестовую специализацию для ReceptionTemplate
        self.specialization = Specialization.objects.create(title="Default Specialization")

        # Создаем минимальный объект ReceptionTemplate, передавая обязательное поле specialization
        self.reception_template = ReceptionTemplate.objects.create(
            name="Default Template",
            specialization=self.specialization
        )

        # Патчим метод __str__ класса DoctorAppointment, чтобы возвращался фиксированный результат "Appointment 1"
        self.appointment_str_patch = patch.object(DoctorAppointment, '__str__', return_value="Appointment 1")
        self.mock_appointment_str = self.appointment_str_patch.start()
        self.addCleanup(self.appointment_str_patch.stop)

        self.reception_time = ReceptionTime.objects.create(
            reception_day=timezone.now().date() + datetime.timedelta(days=1),
            start_time=datetime.time(8, 0, 0),
            end_time=datetime.time(18, 0, 0),
            doctor=self.employee,
        )

        # Создаем тестовый приём, передавая все обязательные поля
        self.appointment = DoctorAppointment.objects.create(
            signed_by=self.employee,
            assigned_doctor=self.employee,
            appointment_date=timezone.now().date() + datetime.timedelta(days=1),
            start_time=datetime.time(9, 0),
            end_time=datetime.time(10, 0),
            reception_template=self.reception_template
        )

        # Создаем объект госпитализации
        self.start_date = datetime.date(2025, 3, 26)
        self.end_date = datetime.date(2025, 3, 30)
        self.hospital_stay = HospitalStays.objects.create(
            patient=self.patient,
            description="Initial description",
            start_date=self.start_date,
            end_date=self.end_date,
            ward_number="101",
            appointment=self.appointment
        )

    def test_serializer_fields(self):
        """
        Проверяем, что сериализатор возвращает все ожидаемые поля с корректными значениями.
        """
        serializer = HospitalStaysSerializer(instance=self.hospital_stay)
        data = serializer.data

        # Проверяем наличие всех необходимых полей
        expected_fields = [
            'id', 'patient', 'patient_name', 'description',
            'start_date', 'end_date', 'ward_number',
            'appointment', 'appointment_str', 'hospital_stay_str'
        ]
        for field in expected_fields:
            self.assertIn(field, data)

        # Проверяем корректность значений
        self.assertEqual(data['patient'], self.patient.pk)
        self.assertEqual(data['patient_name'], "John Doe")
        self.assertEqual(data['description'], "Initial description")
        self.assertEqual(data['start_date'], self.start_date.strftime('%Y-%m-%d'))
        self.assertEqual(data['end_date'], self.end_date.strftime('%Y-%m-%d'))
        self.assertEqual(data['ward_number'], "101")
        self.assertEqual(data['appointment'], self.appointment.pk)
        self.assertEqual(data['appointment_str'], "Appointment 1")

        # Ожидаемое строковое представление госпитализации согласно методу __str__
        expected_str = f"John Doe - {self.start_date.strftime('%Y-%m-%d')} - 101"
        self.assertEqual(data['hospital_stay_str'], expected_str)

    def test_read_only_fields(self):
        """
        Проверяем, что поля, отмеченные как read_only, не могут быть изменены через сериализатор.
        Попытка обновить вычисляемые поля (patient_name, appointment_str, hospital_stay_str, id)
        должна быть проигнорирована.
        """
        update_data = {
            'patient_name': "Changed Name",
            'appointment_str': "Changed Appointment",
            'hospital_stay_str': "Changed Hospital Stay",
            'description': "Updated description",
            'ward_number': "102",
            'start_date': "2025-04-01",
            'end_date': "2025-04-05",
        }
        serializer = HospitalStaysSerializer(instance=self.hospital_stay, data=update_data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        updated_stay = serializer.save()

        serializer_after_update = HospitalStaysSerializer(instance=updated_stay)
        data_after_update = serializer_after_update.data

        # Проверяем, что вычисляемые поля пересчитаны, а переданные значения для read_only полей игнорируются
        self.assertEqual(data_after_update['patient_name'], "John Doe")
        self.assertEqual(data_after_update['appointment_str'], "Appointment 1")
        expected_str = f"John Doe - {data_after_update['start_date']} - {data_after_update['ward_number']}"
        self.assertEqual(data_after_update['hospital_stay_str'], expected_str)

        # Проверяем, что изменились только разрешённые для записи поля
        self.assertEqual(data_after_update['description'], "Updated description")
        self.assertEqual(data_after_update['ward_number'], "102")
        self.assertEqual(data_after_update['start_date'], "2025-04-01")
        self.assertEqual(data_after_update['end_date'], "2025-04-05")
