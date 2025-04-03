import { GET } from "@6_shared/api";
import { LaboratoryListQueryParams, PaginatedLaboratoryList } from "../model/model";

// Получение списка всех лабораторий с поддержкой пагинации
export const getAllLaboratory = async (
  params: LaboratoryListQueryParams = {}
): Promise<PaginatedLaboratoryList> => {
  // Отправляем GET-запрос, передавая параметры в query
  const response = await GET("/api/v0/laboratory/", {
    params: {
      query: params 
    } 
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }

  return response.data as PaginatedLaboratoryList;
};