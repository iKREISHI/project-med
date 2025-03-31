from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.response import Response
from apps.ai_recommendations.serializers.patient_conditions import AIRecommendationPatientConditionSerializer
from apps.medical_activity.models import PatientCondition
from apps.ai_recommendations.ai_connector import AIConnector
from config.settings.ai import GigaConf as giga


def get_api_response(prompt: str) -> str:
    ai = AIConnector(giga)
    prompt = f"Все данные пациента: {prompt}. Дай рекомендации для врача."
    response = ai.send_message(prompt)
    return f"{response}"


class AIPatientConditionViewSet(viewsets.ViewSet):
    serializer_class = AIRecommendationPatientConditionSerializer
    queryset = PatientCondition.objects.all()

    @action(
        detail=False,
        methods=["post"],
        url_path="ai-response",
        url_name="ai-response"
    )
    @extend_schema(
        summary="Получение ответа от ИИ с входными данными",
        description=(
                "Эндпоинт принимает поля из AIRecommendationPatientConditionSerializer, "
                "формирует промт для ИИ и возвращает сформированный промт вместе с ответом от ИИ."
        ),
        request=AIRecommendationPatientConditionSerializer,
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
        serializer = AIRecommendationPatientConditionSerializer(data=request.data)
        if serializer.is_valid():
            ai_prompt = serializer.generate_ai_prompt(serializer.validated_data)
            ai_response = get_api_response(ai_prompt)
            response_data = {"ai_response": ai_response}
            response_data["ai_prompt"] = ai_prompt
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)