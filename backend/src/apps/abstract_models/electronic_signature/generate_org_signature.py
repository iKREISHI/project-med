import secrets
import hashlib

def generate_org_signature():
    """
    Генерирует подпись в виде строки формата "data|checksum".
    data - случайная строка,
    checksum - целое число, вычисленное как первые 8 символов SHA256 от data (в 16-ричном формате).
    """
    data = secrets.token_urlsafe(64)
    checksum = int(hashlib.sha256(data.encode('utf-8')).hexdigest()[:8], 16)
    return f"{data}|{checksum}"

def verify_org_signature(signature):
    """
    Проверяет, корректна ли подпись.
    Ожидается, что signature имеет формат "data|checksum".
    Возвращает True, если подпись верна, иначе False.
    """
    try:
        data, checksum_str = signature.split("|")
        checksum = int(checksum_str)
    except (ValueError, AttributeError):
        return False
    computed_checksum = int(hashlib.sha256(data.encode('utf-8')).hexdigest()[:8], 16)
    return computed_checksum == checksum