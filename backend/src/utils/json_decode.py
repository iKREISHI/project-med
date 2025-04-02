import json


def extract_fields(data, parent_key=''):
    """
    Рекурсивно обходит JSON-объект и возвращает словарь,
    где ключами являются пути к элементам, а значениями — конечные значения.

    Примеры путей:
    - "name" для верхнего уровня,
    - "address.city" для вложенных полей,
    - "hobbies[0]" для элементов списка.
    """
    fields = {}

    if isinstance(data, dict):
        for key, value in data.items():
            full_key = f"{parent_key}.{key}" if parent_key else key
            # Если значение само является словарем или списком, рекурсивно его обрабатываем
            if isinstance(value, (dict, list)):
                fields.update(extract_fields(value, full_key))
            else:
                fields[full_key] = value
    elif isinstance(data, list):
        for index, item in enumerate(data):
            full_key = f"{parent_key}[{index}]"
            if isinstance(item, (dict, list)):
                fields.update(extract_fields(item, full_key))
            else:
                fields[full_key] = item

    return fields


def dict_to_str(d: dict) -> str:
    """
    Преобразует словарь в строку, где каждая пара представлена в виде 'ключ: значение'.
    Каждая пара находится на новой строке.
    """
    return "\n".join(f"{key}: {value}" for key, value in d.items())
