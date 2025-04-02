// @ts-nocheck
// @ts-nocheck
import { DELETE } from "@6_shared/api";

//Удаление пациента по ID
export const deletePatient = async (patientId: number): Promise<void> => {
  try {
    const response = await DELETE("/api/v0/patient/{id}/", {
      params: {
        path: { id: patientId }, //В путь пробрасывается id пациента
        query: undefined,
        header: undefined,
        cookie: undefined
      }
    });

    if (response.error === 404) {
      throw new Error("Пациент не найден");
    }

    if (response.error !== 204) {
      throw new Error(`Неожиданный статус ответа: ${response.error}`);
    }
  } catch (error) {
    console.error("Ошибка при удалении пациента:", error);
    throw error;
  }
};