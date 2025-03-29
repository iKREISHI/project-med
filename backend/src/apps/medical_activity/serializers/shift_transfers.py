from rest_framework import serializers
from apps.medical_activity.models import ShiftTransfer


class ShiftTransferSerializer(serializers.ModelSerializer):
    from_shift_str = serializers.SerializerMethodField()
    to_shift_str = serializers.SerializerMethodField()
    transfer_str = serializers.SerializerMethodField()
    date = serializers.DateTimeField(format='%Y-%m-%d %H:%M', read_only=True)

    class Meta:
        model = ShiftTransfer
        fields = [
            'id',
            'from_shift',
            'from_shift_str',
            'to_shift',
            'to_shift_str',
            'date',
            'comment',
            'transfer_str',
            'document_template',
            'document',
            'document_fields'
        ]
        read_only_fields = ['id', 'from_shift_str', 'to_shift_str', 'transfer_str']

    def get_from_shift_str(self, obj):
        return str(obj.from_shift)

    def get_to_shift_str(self, obj):
        return str(obj.to_shift)

    def get_transfer_str(self, obj):
        return str(obj)
