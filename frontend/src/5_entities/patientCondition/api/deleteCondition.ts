import { DELETE } from "@6_shared/api";

//Удаление пациента по ID
export const deleteCondition = async (conditionId: number): Promise<void> => {
  try {
    const response = await DELETE("/api/v0/patient-conditions/{id}/", {
      params: {
        path: { id: conditionId }, //В путь пробрасывается id пациента
        query: undefined,
        header: undefined,
        cookie: undefined
      }
    });

    if (response.error === 404) {
      throw new Error("Состояние не найден");
    }

    if (response.error !== 204) {
      throw new Error(`Неожиданный статус ответа: ${response.error}`);
    }
  } catch (error) {
    console.error("Ошибка при удалении состояния:", error);
    throw error;
  }
};