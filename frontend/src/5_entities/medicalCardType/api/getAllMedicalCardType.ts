import {MedicalCardTypeListQueryParams, PaginatedMedicalCardTypeList} from "@5_entities/medicalCardType/model/model.ts";
import { GET } from "@6_shared/api";


export const getAllMedicalCardType =  async (
  params: MedicalCardTypeListQueryParams = {}
):Promise<PaginatedMedicalCardTypeList> => {
  const response = await GET('/api/v0/medical-card-types/',{
    query:params,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }

  return response.data;
}