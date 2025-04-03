import {Specialization, PaginatedSpecializationList} from "@5_entities/specialization/model/model.ts";
import {POST} from "@6_shared/api";

export const addNewSpecialization = async (
  data: Omit<Specialization, "id" | "date_created"> 
): Promise<Specialization> => {
  const response = await POST('/api/v0/specialization/',{
    body: data,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: пустой ответ от сервера");
  }

  return response.data;
}