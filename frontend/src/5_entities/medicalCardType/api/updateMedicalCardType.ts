import {PUT} from "@6_shared/api";
import { MedicalCardType } from '../model/model.ts'


export const updateMedicalCardType = async (
  medicalCardTypeId: number,
  medicalCardTypeData: Omit<MedicalCardType, 'id' | 'date_created'>
): Promise<MedicalCardType> => {
  const response = await PUT('/api/v0/medical-card-types/{id}/', {
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
  return response.data as MedicalCardType;
}