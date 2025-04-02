import { PUT } from "@6_shared/api";
import {Patient} from "@5_entities/patient";
import { PatientCondition } from "../model/model";

export const updateCondition = async (
  conditionId: number,
  conditionData: Omit<PatientCondition, "id" | "date_created">
): Promise<void> => {
  const response = await PUT('/api/v0/patient/{id}/', {
    params: {
      path: { id: conditionId },
      query: undefined, // Явно указываем остальные параметры
      header: undefined,
      cookie: undefined
    },
    body: conditionData,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }
};