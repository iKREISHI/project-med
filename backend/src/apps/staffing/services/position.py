from apps.staffing.models import Position
from rest_framework.exceptions import ValidationError


class PositionService:
    """
    Сервис для работы с моделью Position.
    Предоставляет методы для создания, обновления, получения и удаления должности.
    """

    @staticmethod
    def create_position(**data) -> Position:
        """
        Создает новую должность с валидацией.

        Аргументы:
            data: Именованные аргументы, соответствующие полям модели Position.

        Возвращает:
            Созданный объект Position.

        Исключения:
            ValidationError, если данные не проходят валидацию.
        """
        position = Position(**data)
        position.full_clean()  # Вызов clean() модели для проверки валидаторов
        position.save()
        return position

    @staticmethod
    def update_position(position: Position, **data) -> Position:
        """
        Обновляет данные должности.

        Аргументы:
            position: Объект Position, который необходимо обновить.
            data: Именованные аргументы, соответствующие обновляемым полям модели.

        Возвращает:
            Обновленный объект Position.

        Исключения:
            ValueError, если передано несуществующее поле.
            ValidationError, если обновленные данные не проходят валидацию.
        """
        for field, value in data.items():
            if hasattr(position, field):
                setattr(position, field, value)
            else:
                raise ValueError(f"Position has no field: {field}")
        position.full_clean()
        position.save()
        return position

    @staticmethod
    def get_position_by_pk(pk: int) -> Position:
        """
        Возвращает должность по её UUID.

        Аргументы:
            uuid_str: Строковое представление UUID должности.

        Возвращает:
            Объект Position или None, если должность с указанным UUID не найдена.
        """
        return Position.objects.filter(pk=pk).first()

    @staticmethod
    def delete_position(position: Position) -> None:
        """
        Удаляет должность из базы данных.

        Аргументы:
            position: Объект модели Position, который необходимо удалить.
        """
        position.delete()
