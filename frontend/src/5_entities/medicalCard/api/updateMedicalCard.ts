import {PUT} from "@6_shared/api";
import { MedicalCard } from '../model/model.ts'


export const updateMedicalCard = async (
  medicalCardTypeId: number,
  medicalCardTypeData: Omit<MedicalCard, 'id' | 'date_created'>
): Promise<MedicalCard> => {
  const response = await PUT('/api/v0/medical-card/{id}/', {
    params: {
      path:{
        id:medicalCardTypeId,
      }
    },
    body: medicalCardTypeData,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }
  return response.data as MedicalCard;
}