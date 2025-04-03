import {MedicalCardType, PaginatedMedicalCardTypeList} from "@5_entities/medicalCardType/model/model.ts";
import {POST} from "@6_shared/api";

export const addNewMedicalCardType = async (
  data: Omit<MedicalCardType, "id" | "date_created"> // Принимаем данные без id
): Promise<MedicalCardType> => { 
  const response = await POST('/api/v0/medical-card-types/',{
    body: data,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: пустой ответ от сервера");
  }

  return response.data;
}