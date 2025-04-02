from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.response import Response
from apps.ai_recommendations.serializers.doctor_appointment import AIRecommendationsDoctorAppointmentSerializer
from apps.medical_activity.models import DoctorAppointment
from apps.ai_recommendations.ai_connector import AIConnector
from config.settings.ai import GigaConf as giga


def get_ai_response(prompt: str) -> str:
    """
    Функция-заглушка для получения ответа от ИИ.
    Здесь следует интегрировать вызов вашего ИИ-сервиса, например, через OpenAI API.
    """
    ai = AIConnector(giga)
    response = ai.send_message(prompt)
    return f"{response}"

class AIDoctorAppointmentViewSet(viewsets.ViewSet):
    serializer_class = AIRecommendationsDoctorAppointmentSerializer
    queryset = DoctorAppointment.objects.all()

    @action(
        detail=False,
        methods=["post"],
        url_path="ai-response",
        url_name="ai-response"
    )
    @extend_schema(
        summary="Получение ответа от ИИ с входными данными",
        description=(
            "Эндпоинт принимает поля из AIRecommendationsDoctorAppointmentSerializer, "
            "формирует промт для ИИ и возвращает сформированный промт вместе с ответом от ИИ."
        ),
        request=AIRecommendationsDoctorAppointmentSerializer,
        responses={
            status.HTTP_200_OK: {
                "type": "object",
                "properties": {
                    "ai_prompt": {
                        "type": "string",
                        "description": "Сформированный промт для ИИ"
                    },
                    "ai_response": {
                        "type": "string",
                        "description": "Ответ, полученный от ИИ"
                    }
                }
            },
            status.HTTP_400_BAD_REQUEST: {"description": "Ошибка валидации данных"}
        }
    )
    def ai_response(self, request):
        serializer = AIRecommendationsDoctorAppointmentSerializer(data=request.data)
        if serializer.is_valid():
            # Формирование промта для ИИ на основе валидированных данных
            ai_prompt = serializer.generate_ai_prompt(serializer.validated_data)
            # Получение ответа от ИИ
            ai_response = get_ai_response(ai_prompt)
            # Добавляем промт и ответ к данным сериализатора
            # response_data = serializer.data
            response_data = {"ai_response": ai_response}
            response_data["ai_prompt"] = ai_prompt
            # response_data["ai_response"] = ai_response
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
