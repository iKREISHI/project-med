import { PUT } from "@6_shared/api";
import { Position } from "../model/model.ts";

//Обновление данных о Должностях
export const updatePositions = async (
  patientId: number,
  patientData: Omit<Position, "id" | "date_created">
): Promise<void> => {
  const response = await PUT('/api/v0/position/{id}/', {
    params: {
      path: { id: patientId },
      query: undefined,
      header: undefined,
      cookie: undefined
    },
    body: patientData,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }
};