from apps.staffing.models import Employee
from rest_framework.exceptions import ValidationError


class EmployeeService:
    """
    Сервис для работы с моделью Employee.
    Предоставляет методы для создания, обновления, получения и удаления сотрудников.
    """

    @staticmethod
    def create_employee(**data) -> Employee:
        """
        Создает нового сотрудника с валидацией.

        Аргументы:
            data: Именованные аргументы, соответствующие полям модели Employee.

        Возвращает:
            Созданный объект Employee.

        Исключения:
            ValidationError, если данные не проходят валидацию.
        """
        employee = Employee(**data)
        employee.full_clean()  # Вызов clean() модели для проверки данных
        employee.save()
        return employee

    @staticmethod
    def update_employee(employee: Employee, **data) -> Employee:
        """
        Обновляет данные сотрудника.

        Аргументы:
            employee: Объект Employee, который требуется обновить.
            data: Именованные аргументы, соответствующие обновляемым полям модели.

        Возвращает:
            Обновленный объект Employee.

        Исключения:
            ValueError, если указано поле, которого нет в модели.
            ValidationError, если обновленные данные не проходят валидацию.
        """
        for field, value in data.items():
            if hasattr(employee, field):
                setattr(employee, field, value)
            else:
                raise ValueError(f"Сотрудник не имеет поля: {field}")
        employee.full_clean()
        employee.save()
        return employee

    @staticmethod
    def get_employee_by_pk(pk: int) -> Employee:
        """
        Возвращает сотрудника по его UUID.

        Аргументы:
            uuid_str: Строковое представление UUID сотрудника.

        Возвращает:
            Объект Employee или None, если сотрудник с указанным UUID не найден.
        """
        return Employee.objects.filter(pk=pk).first()

    @staticmethod
    def delete_employee(employee: Employee) -> None:
        """
        Удаляет сотрудника из базы данных.

        Аргументы:
            employee: Объект модели Employee, который требуется удалить.
        """
        employee.delete()
