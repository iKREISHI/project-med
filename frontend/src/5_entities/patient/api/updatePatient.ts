import { PUT } from "@6_shared/api";
import {Patient} from "@5_entities/patient";

//Обновление данных о ПАЦИЕНТЕ
export const updatePatient = async (
  patientId: number,
  patientData: Omit<Patient, "id" | "date_created">
): Promise<void> => {
  const response = await PUT('/api/v0/patient/{id}/', {
    params: {
      path: { id: patientId },
      query: undefined, // Явно указываем остальные параметры
      header: undefined,
      cookie: undefined
    },
    body: patientData,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }
};