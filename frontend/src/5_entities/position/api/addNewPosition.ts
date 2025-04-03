import { Position } from "../model/model.ts";
import { POST } from "../../../6_shared/api/index.ts";
//Добавление новой должности 
export const addNewPosition = async (
  data: Omit<Position, "id" | "data_created">
): Promise<Position> => {
  const response = await POST("/api/v0/position/", {
    body: data,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: пустой ответ от сервера");
  }

  return response.data;
};
 