// @ts-nocheck
// @ts-nocheck
import { Position } from "../model/model.ts";
import { POST } from "../../../6_shared/api/index.ts";

//Добавление нового пациента
export const addNewPosition = async (
  positionData: Omit<Position, "id" | "data_created">
): Promise<Position> => {
  const response = await POST("/api/v0/patient/", {
    body: positionData,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: пустой ответ от сервера");
  }

  return response.data;
};
