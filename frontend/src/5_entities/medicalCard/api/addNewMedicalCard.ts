import {MedicalCard, PaginatedMedicalCardList} from "@5_entities/medicalCard/model/model.ts";
import {POST} from "@6_shared/api";

export const addNewMedicalCard = async (
  data: Omit<MedicalCard, "id" | "date_created"> // Принимаем данные без id
): Promise<MedicalCard> => { 
  const response = await POST('/api/v0/medical-card/',{
    body: data,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: пустой ответ от сервера");
  }

  return response.data;
}