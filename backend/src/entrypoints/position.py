def setup_positions():
    """
    Создает должности (Position) и связывает их с группами.
    """
    from django.contrib.auth.models import Group
    from apps.staffing.models import Position

    positions_data = [
        {
            'name': 'Врач',
            'short_name': 'Врач',
            'minzdrav_position': 'Доктор',
            'group_name': 'Врачи'
        },
        {
            'name': 'Медсестра',
            'short_name': 'Медсестра',
            'minzdrav_position': 'Медсестра',
            'group_name': 'Медсестры'
        },
        {
            'name': 'Администратор',
            'short_name': 'Админ',
            'minzdrav_position': 'Администратор',
            'group_name': 'Администраторы'
        },
        {
            'name': 'Регистратор',
            'short_name': 'Регистратор',
            'minzdrav_position': 'Регистратор',
            'group_name': 'Регистраторы'
        },
    ]

    for data in positions_data:
        try:
            group = Group.objects.get(name=data['group_name'])
        except Group.DoesNotExist:
            print(f"Группа {data['group_name']} не найдена. Пропускаем создание позиции.")
            continue

        position, created = Position.objects.get_or_create(
            group=group,
            name=data['name'],
            defaults={
                'short_name': data['short_name'],
                'minzdrav_position': data['minzdrav_position']
            }
        )
        if created:
            print(f"Создана должность: {position.name} для группы {group.name}")
        else:
            print(f"Должность {position.name} для группы {group.name} уже существует")