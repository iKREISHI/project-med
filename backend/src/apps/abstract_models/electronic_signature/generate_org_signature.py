import secrets
import hashlib

def generate_org_signature():
    """
    Генерирует подпись в формате:
    {
        "data": "случайная строка...",
        "checksum": целое число (первые 8 символов SHA256 от data, преобразованные в целое число)
    }
    """
    data = secrets.token_urlsafe(64)
    # Вычисляем SHA256-хэш и берём первые 8 символов, затем преобразуем в целое число (в 16-ричном формате)
    checksum = int(hashlib.sha256(data.encode('utf-8')).hexdigest()[:8], 16)
    return {"data": data, "checksum": checksum}

def verify_org_signature(signature):
    """
    Проверяет, соответствует ли переданная подпись вычисленной для data.
    Возвращает True, если подпись корректна, иначе False.
    """
    data = signature.get("data")
    checksum = signature.get("checksum")
    if not data or checksum is None:
        return False
    computed_checksum = int(hashlib.sha256(data.encode('utf-8')).hexdigest()[:8], 16)
    return computed_checksum == checksum