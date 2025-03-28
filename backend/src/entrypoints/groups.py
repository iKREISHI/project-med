import os
import django
from django.contrib.auth.models import Group, Permission

# Определяем списки разрешений для каждого приложения и уровня доступа

# Для приложений, где нужен только доступ на чтение
staffing_view = [
    "staffing.view_employee",
    "staffing.view_position",
    "staffing.view_receptiontime",
    "staffing.view_specialization",
]

clients_view = [
    "clients.view_contractor",
    "clients.view_patient",
]

registry_view = [
    "registry.view_medicalcard",
    "registry.view_medicalcardtype",
]

# Полный (CRUD) доступ для приложений
staffing_full = [
    "staffing.add_employee",
    "staffing.change_employee",
    "staffing.delete_employee",
    "staffing.view_employee",
    "staffing.add_position",
    "staffing.change_position",
    "staffing.delete_position",
    "staffing.view_position",
    "staffing.add_receptiontime",
    "staffing.change_receptiontime",
    "staffing.delete_receptiontime",
    "staffing.view_receptiontime",
    "staffing.add_specialization",
    "staffing.change_specialization",
    "staffing.delete_specialization",
    "staffing.view_specialization",
]

clients_full = [
    "clients.add_contractor",
    "clients.change_contractor",
    "clients.delete_contractor",
    "clients.view_contractor",
    "clients.add_patient",
    "clients.change_patient",
    "clients.delete_patient",
    "clients.view_patient",
]

registry_full = [
    "registry.add_medicalcard",
    "registry.change_medicalcard",
    "registry.delete_medicalcard",
    "registry.view_medicalcard",
    "registry.add_medicalcardtype",
    "registry.change_medicalcardtype",
    "registry.delete_medicalcardtype",
    "registry.view_medicalcardtype",
]

# Для приложения medical_activity: полный доступ или только на чтение
medical_activity_full = [
    "medical_activity.add_bookingappointment",
    "medical_activity.change_bookingappointment",
    "medical_activity.delete_bookingappointment",
    "medical_activity.view_bookingappointment",
    "medical_activity.add_diagnosis",
    "medical_activity.change_diagnosis",
    "medical_activity.delete_diagnosis",
    "medical_activity.view_diagnosis",
    "medical_activity.add_diagnosiscategory",
    "medical_activity.change_diagnosiscategory",
    "medical_activity.delete_diagnosiscategory",
    "medical_activity.view_diagnosiscategory",
    "medical_activity.add_doctorappointment",
    "medical_activity.change_doctorappointment",
    "medical_activity.delete_doctorappointment",
    "medical_activity.view_doctorappointment",
    "medical_activity.add_hospitalstays",
    "medical_activity.change_hospitalstays",
    "medical_activity.delete_hospitalstays",
    "medical_activity.view_hospitalstays",
    "medical_activity.add_patientcondition",
    "medical_activity.change_patientcondition",
    "medical_activity.delete_patientcondition",
    "medical_activity.view_patientcondition",
    "medical_activity.add_receptiontemplate",
    "medical_activity.change_receptiontemplate",
    "medical_activity.delete_receptiontemplate",
    "medical_activity.view_receptiontemplate",
    "medical_activity.add_shift",
    "medical_activity.change_shift",
    "medical_activity.delete_shift",
    "medical_activity.view_shift",
    "medical_activity.add_shifttransfer",
    "medical_activity.change_shifttransfer",
    "medical_activity.delete_shifttransfer",
    "medical_activity.view_shifttransfer",
]

# Для группы "Регестраторы": полные права только на bookingappointment, для остальных – только чтение
medical_booking_full = [
    "medical_activity.add_bookingappointment",
    "medical_activity.change_bookingappointment",
    "medical_activity.delete_bookingappointment",
    "medical_activity.view_bookingappointment",
]
medical_others_view = [
    "medical_activity.view_diagnosis",
    "medical_activity.view_diagnosiscategory",
    "medical_activity.view_doctorappointment",
    "medical_activity.view_hospitalstays",
    "medical_activity.view_patientcondition",
    "medical_activity.view_receptiontemplate",
    "medical_activity.view_shift",
    "medical_activity.view_shifttransfer",
]

# Для "Работник отдела кадров": чтение для medical_activity (включая bookingappointment)
medical_view = [
    "medical_activity.view_bookingappointment",
    "medical_activity.view_diagnosis",
    "medical_activity.view_diagnosiscategory",
    "medical_activity.view_doctorappointment",
    "medical_activity.view_hospitalstays",
    "medical_activity.view_patientcondition",
    "medical_activity.view_receptiontemplate",
    "medical_activity.view_shift",
    "medical_activity.view_shifttransfer",
]

# Полный доступ для приложения chat
chat_full = [
    "chat.add_chatroom",
    "chat.change_chatroom",
    "chat.delete_chatroom",
    "chat.view_chatroom",
    "chat.add_filemessage",
    "chat.change_filemessage",
    "chat.delete_filemessage",
    "chat.view_filemessage",
    "chat.add_imagemessage",
    "chat.change_imagemessage",
    "chat.delete_imagemessage",
    "chat.view_imagemessage",
    "chat.add_textmessage",
    "chat.change_textmessage",
    "chat.delete_textmessage",
    "chat.view_textmessage",
]

# Для пользователей – только чтение
users_view = [
    "users.view_user",
]

# Для приложения company_structure: чтение и полный доступ
company_structure_view = [
    "company_structure.view_filial",
    "company_structure.view_filialdepartment",
]

company_structure_full = [
    "company_structure.add_filial",
    "company_structure.change_filial",
    "company_structure.delete_filial",
    "company_structure.view_filial",
    "company_structure.add_filialdepartment",
    "company_structure.change_filialdepartment",
    "company_structure.delete_filialdepartment",
    "company_structure.view_filialdepartment",
]

# Определяем конфигурацию групп и их разрешений
# 1) Врачи и 2) Медсестры: staffing, clients - чтение; registry, medical_activity, chat - полный доступ
common_doctor_nurse = staffing_view + clients_view + registry_full + medical_activity_full + chat_full

# 3) Регестраторы: clients, registry, chat - полный доступ; medical_activity - bookingappointment (полностью), остальные – чтение; users – чтение
registrator_perms = (
        clients_full +
        registry_full +
        chat_full +
        medical_booking_full + medical_others_view +
        users_view
)

# 4) Заведующий отделением: для чтения - users, staffing, company_structure; полный доступ - registry, medical_activity, chat, clients
head_perms = (
        users_view +
        staffing_view +
        company_structure_view +
        registry_full +
        medical_activity_full +
        chat_full +
        clients_full
)

# 6) Работник отдела кадров: staffing, company_structure - полный доступ; medical_activity, registry - чтение
hr_perms = (
        staffing_full +
        company_structure_full +
        medical_view +
        registry_view
)

group_permissions = {
    "Врач": common_doctor_nurse,
    "Медсестра": common_doctor_nurse,
    "Регистратор": registrator_perms,
    "Заведующий отделением": head_perms,
    "Работник отдела кадров": hr_perms,
}


def setup_groups_and_permissions():
    """
    Создает группы и назначает им права согласно заданной конфигурации.
    """
    # Создаем или обновляем группы для перечисленных пользователей
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

    # 5) Администратор - полный доступ ко всему
    admin_group, created = Group.objects.get_or_create(name="Администратор")
    if created:
        print("Группа 'Администратор' создана.")
    else:
        print("Группа 'Администратор' уже существует.")
    # Назначаем все права группе "Администратор"
    all_permissions = Permission.objects.all()
    admin_group.permissions.set(all_permissions)
    admin_group.save()
    print("Группа 'Администратор' обновлена с полным доступом ко всем правам.")