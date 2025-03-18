from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    position_uuid = serializers.CharField(
        source='employee_profile.position.uuid',
        read_only=True
    )
    position_name = serializers.CharField(
        source='employee_profile.position.name',
        read_only=True
    )

    class Meta:
        model = User
        fields = ['uuid', 'username', 'position_uuid', 'position_name']
        read_only_fields = ['uuid']
