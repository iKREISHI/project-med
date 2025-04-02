import { GET } from "@6_shared/api";
import {PaginatedPositionList, PositionListQueryParams} from "@5_entities/position/model/model.ts";

//Получение списка всех пациентов с поддержкой пагинации
export const getAllPositions = async (
  params: PositionListQueryParams = {}
): Promise<PaginatedPositionList> => {
  // Отправляем GET-запрос, передавая параметры в query
  const response = await GET("/api/v0/position/", {
    query: params,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }

  return response.data as PaginatedPositionList
};