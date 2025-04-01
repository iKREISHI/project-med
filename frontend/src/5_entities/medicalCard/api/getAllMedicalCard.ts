import {MedicalCardListQueryParams, PaginatedMedicalCardList} from "@5_entities/medicalCard/model/model.ts";
import { GET } from "@6_shared/api";


export const getAllMedicalCard =  async (
  params: MedicalCardListQueryParams = {}
):Promise<PaginatedMedicalCardList> => {
  const response = await GET('/api/v0/medical-card/',{
    query:params,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }

  return response.data;
}