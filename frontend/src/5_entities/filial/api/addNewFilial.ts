import {Filial, PaginatedFilialList} from "@5_entities/filial/model/model.ts";
import {POST} from "@6_shared/api";

export const addNewFilial = async (
  data: Omit<Filial, "id" | "date_created"> // Принимаем данные без id
): Promise<Filial> => {
  const response = await POST('/api/v0/filial/',{
    body: data,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: пустой ответ от сервера");
  }

  return response.data;
}