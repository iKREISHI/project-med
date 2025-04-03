import { FilialDepartament } from "@5_entities/departament";
import { POST } from "../../../6_shared/api/index.ts";
//Добавление новой должности 
export const addNewDepartaments = async (
  data: Omit<FilialDepartament, "id" | "data_created">
): Promise<FilialDepartament> => {
  const response = await POST("/api/v0/filial-departments/", {
    body: data,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: пустой ответ от сервера");
  }

  return response.data;
};
