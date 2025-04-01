import {MedicalCardType} from "@5_entities/medicalCardType/model/model.ts";
import { GET } from "@6_shared/api";

export const getMedicalCardType = async (
  medicalCardTypeId: number,
):Promise<MedicalCardType> =>{
  const response = await GET('/api/v0/medical-card/{id}/',{
    params:{
      path:{
        id:medicalCardTypeId,
      },
    },
  });
  if (!response) {
    throw new Error("Ошибка: пустой ответ от сервера");
  }

  return response.data as MedicalCardType;
}