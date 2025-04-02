import { GET } from "@6_shared/api";
import { PaginatedShiftList, ShiftListQueryParams } from "../model/model";

export const getAllShifts = async (
  params: ShiftListQueryParams = {}
): Promise<PaginatedShiftList> => {
  // Отправляем GET-запрос, передавая параметры в query
  const response = await GET("/api/v0/shift/", {
    query: params,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }

  return response.data as PaginatedShiftList;
};