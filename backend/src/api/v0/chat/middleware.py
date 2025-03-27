from channels.db import database_sync_to_async
from django.contrib.sessions.models import Session
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from http.cookies import SimpleCookie

User = get_user_model()


@database_sync_to_async
def get_user_from_session(session_key):
    try:
        session = Session.objects.get(session_key=session_key)
        session_data = session.get_decoded()
        user_id = session_data.get('_auth_user_id')
        if user_id:
            return User.objects.get(pk=user_id)
    except Session.DoesNotExist:
        pass
    return AnonymousUser()


class HeaderSessionAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        headers = dict(scope.get("headers", []))
        session_key = None
        # Получаем значение заголовка cookie (если оно есть)
        cookie_header = headers.get(b"cookie")
        if cookie_header:
            cookie = SimpleCookie()
            cookie.load(cookie_header.decode())
            if 'sessionid' in cookie:
                session_key = cookie['sessionid'].value
            else:
                raise ValueError('User not authenticated')

        # Теперь можно использовать session_key для аутентификации
        # Например, получить пользователя из сессии:
        scope["user"] = await get_user_from_session(session_key) if session_key else AnonymousUser()
        return await self.inner(scope, receive, send)
