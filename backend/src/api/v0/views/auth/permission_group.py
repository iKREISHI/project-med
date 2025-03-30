from django.contrib.auth.models import Permission, Group
from django.db.models import Q
from rest_framework import viewsets, serializers, permissions
from rest_framework.response import Response


class PermissionSerializer(serializers.ModelSerializer):
    """
    Сериализатор для прав (permissions)
    """
    content_type = serializers.StringRelatedField()

    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename', 'content_type']


class GroupSerializer(serializers.ModelSerializer):
    """
    Сериализатор для групп
    """
    class Meta:
        model = Group
        fields = ['id', 'name']


class GetGroupAndPermissions4CurrentUser(viewsets.ViewSet):
    """
    ViewSet для получения прав текущего пользователя и его групп.
    """
    queryset = Group.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            return Response(
                {"detail": "Необходимо пройти аутентификацию."},
                status=401
            )

        # Получаем права, назначенные напрямую пользователю,
        # а также права, полученные через группы (без дублирования)
        permissions = Permission.objects.filter(
            Q(user=user) | Q(group__user=user)
        ).distinct()

        # Получаем группы пользователя
        groups = user.groups.all()

        data = {
            # "permissions": PermissionSerializer(permissions, many=True).data,
            "groups": GroupSerializer(groups, many=True).data,
        }
        return Response(data)
