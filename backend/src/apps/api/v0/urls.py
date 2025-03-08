from django.urls import path
from rest_framework.routers import DefaultRouter

from .views.auth import (
    LoginViewSet, LogoutViewSet
)
from .views.registration import RegistrationViewSet


router = DefaultRouter()
router.register('login', LoginViewSet, basename='login')
router.register('logout', LogoutViewSet, basename='logout')
router.register('registration', RegistrationViewSet, basename='registration')

urlpatterns = router.urls