from rest_framework.permissions import BasePermission, SAFE_METHODS


class StrictDjangoModelPermissions(BasePermission):
    """
    Требует, чтобы пользователь имел необходимые разрешения даже для безопасных методов.
    Для GET, HEAD, OPTIONS требуется разрешение view_<model>.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        model = view.queryset.model
        required_perms = self.get_required_permissions(request.method, model)
        return request.user.has_perms(required_perms)

    def get_required_permissions(self, method, model_cls):
        if method in SAFE_METHODS:
            return ["{}.view_{}".format(model_cls._meta.app_label, model_cls._meta.model_name)]
        elif method == "POST":
            return ["{}.add_{}".format(model_cls._meta.app_label, model_cls._meta.model_name)]
        elif method in ["PUT", "PATCH"]:
            return ["{}.change_{}".format(model_cls._meta.app_label, model_cls._meta.model_name)]
        elif method == "DELETE":
            return ["{}.delete_{}".format(model_cls._meta.app_label, model_cls._meta.model_name)]
        return []
