// @ts-nocheck
import { GET } from "@6_shared/api";
import {PaginatedSpecializationList, SpecializationListQueryParams} from "@5_entities/specialization";

//Получение списка всех пациентов с поддержкой пагинации
export const getAllSpecialization = async (
  params: SpecializationListQueryParams = {}
): Promise<PaginatedSpecializationList> => {
  // Отправляем GET-запрос, передавая параметры в query
  const response = await GET("/api/v0/specialization/", {
    params: {
      query: params 
    } 
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }

  return response.data as PaginatedSpecializationList;
};