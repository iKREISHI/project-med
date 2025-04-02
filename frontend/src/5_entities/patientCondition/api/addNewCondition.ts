import { PatientCondition } from "../model/model.ts";
import { POST } from "../../../6_shared/api";

//Добавление нового пациента
export const addNewCondition = async (
  conditionData: Omit<PatientCondition, "id" | "data_created">
): Promise<PatientCondition> => {
  const response = await POST("/api/v0/patient-conditions/", {
    body: conditionData,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: пустой ответ от сервера");
  }

  return response.data;
};
