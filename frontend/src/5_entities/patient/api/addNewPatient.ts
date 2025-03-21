import { Patient } from "../model/model.ts";
import { POST } from "../../../6_shared/api";

export const addNewPatient = async (
  patientData: Omit<Patient, "id" | "date_created">
): Promise<Patient> => {
  const response = await POST("/api/v0/patient/", {
    body: patientData, // Ошибка могла быть из-за неправильного тела запроса
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: пустой ответ от сервера");
  }

  return response.data; // Сервер вернёт полный объект `Patient`
};
