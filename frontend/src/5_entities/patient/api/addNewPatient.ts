import { Patient } from "../model/model.ts";
import { POST } from "../../../6_shared/api";

//Добавление нового пациента
export const addNewPatient = async (
  patientData: Omit<Patient, "id" | "data_created">
): Promise<Patient> => {
  const response = await POST("/api/v0/patient/", {
    body: patientData,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: пустой ответ от сервера");
  }

  return response.data;
};
