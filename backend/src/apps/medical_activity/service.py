from django.core.exceptions import ValidationError
from apps.medical_activity.models import DoctorAppointment


class DoctorAppointmentService:
    """
    Сервис для работы с моделью DoctorAppointment.
    Предоставляет методы для создания, обновления, получения и удаления приемов.
    """

    @staticmethod
    def create_appointment(**data) -> DoctorAppointment:
        """
        Создает новый прием с валидацией.

        Аргументы:
            data: Именованные аргументы, соответствующие полям модели DoctorAppointment.

        Возвращает:
            Созданный объект DoctorAppointment.

        Исключения:
            ValidationError, если данные не проходят валидацию.
        """
        appointment = DoctorAppointment(**data)
        appointment.full_clean()
        appointment.save()
        return appointment

    @staticmethod
    def update_appointment(appointment: DoctorAppointment, **data) -> DoctorAppointment:
        """
        Обновляет данные приема.

        Аргументы:
            appointment: Объект DoctorAppointment, который необходимо обновить.
            data: Именованные аргументы с обновляемыми данными.

        Возвращает:
            Обновленный объект DoctorAppointment.

        Исключения:
            ValueError, если передано несуществующее поле.
            ValidationError, если обновленные данные не проходят валидацию.
        """
        for field, value in data.items():
            if hasattr(appointment, field):
                setattr(appointment, field, value)
            else:
                raise ValueError(f"DoctorAppointment has no field: {field}")
        appointment.full_clean()
        appointment.save()
        return appointment

    @staticmethod
    def get_appointment_by_id(appointment_id: int) -> DoctorAppointment:
        """
        Возвращает прием по его идентификатору.

        Аргументы:
            appointment_id: Идентификатор приема (primary key).

        Возвращает:
            Объект DoctorAppointment или None, если прием не найден.
        """
        return DoctorAppointment.objects.filter(id=appointment_id).first()

    @staticmethod
    def delete_appointment(appointment: DoctorAppointment) -> None:
        """
        Удаляет прием из базы данных.

        Аргументы:
            appointment: Объект DoctorAppointment, который требуется удалить.
        """
        appointment.delete()
