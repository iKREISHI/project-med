def setup_groups_and_permissions():
    """
    Создает группы и назначает им права, согласно заданной конфигурации.
    """
    from django.contrib.auth.models import Group, Permission

    group_permissions = {
        "Врачи": [
            "medical_activity.add_doctorappointment",
            "medical_activity.change_doctorappointment",
            "medical_activity.delete_doctorappointment",
            "medical_activity.view_doctorappointment",
            "clients.view_patient",
            "registry.view_medicalcard",
            "staffing.view_employee",
        ],
        "Медсестры": [
            "medical_activity.view_doctorappointment",
            "clients.view_patient",
            "registry.view_medicalcard",
        ],
        "Администраторы": [
            "admin.add_logentry",
            "admin.change_logentry",
            "admin.delete_logentry",
            "admin.view_logentry",
            "auth.add_group",
            "auth.change_group",
            "auth.delete_group",
            "auth.view_group",
            "auth.add_permission",
            "auth.change_permission",
            "auth.delete_permission",
            "auth.view_permission",
            "contenttypes.add_contenttype",
            "contenttypes.change_contenttype",
            "contenttypes.delete_contenttype",
            "contenttypes.view_contenttype",
            "sessions.add_session",
            "sessions.change_session",
            "sessions.delete_session",
            "sessions.view_session",
            "users.add_user",
            "users.change_user",
            "users.delete_user",
            "users.view_user",
        ],
        "Регистраторы": [
            "clients.add_contractor",
            "clients.change_contractor",
            "clients.delete_contractor",
            "clients.view_contractor",
            "clients.add_patient",
            "clients.change_patient",
            "clients.delete_patient",
            "clients.view_patient",
            "company_structure.add_filial",
            "company_structure.change_filial",
            "company_structure.delete_filial",
            "company_structure.view_filial",
            "company_structure.add_filialdepartment",
            "company_structure.change_filialdepartment",
            "company_structure.delete_filialdepartment",
            "company_structure.view_filialdepartment",
            "registry.add_medicalcard",
            "registry.change_medicalcard",
            "registry.delete_medicalcard",
            "registry.view_medicalcard",
        ]
    }

    for group_name, perms in group_permissions.items():
        group, created = Group.objects.get_or_create(name=group_name)
        if created:
            print(f"Группа '{group_name}' создана.")
        else:
            print(f"Группа '{group_name}' уже существует.")
        group.permissions.clear()
        for perm_str in perms:
            try:
                app_label, codename = perm_str.split(".")
                permission = Permission.objects.get(content_type__app_label=app_label, codename=codename)
                group.permissions.add(permission)
            except Permission.DoesNotExist:
                print(f"Право '{perm_str}' не найдено.")
        group.save()
        print(f"Группа '{group_name}' обновлена с правами: {', '.join(perms)}")
