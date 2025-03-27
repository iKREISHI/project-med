from rest_framework.permissions import BasePermission


class IsChatMember(BasePermission):
    message = "Доступ разрешен только участникам чата."

    def has_object_permission(self, request, view, obj):
        # obj — экземпляр ChatRoom
        return request.user in obj.participants.all()
