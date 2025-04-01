import {MedicalCard} from "@5_entities/medicalCard/model/model.ts";
import { GET } from "@6_shared/api";

export const getMedicalCard = async (
  medicalCardTypeId: number,
):Promise<MedicalCard> =>{
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

  return response.data as MedicalCard;
}