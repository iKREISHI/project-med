// @ts-nocheck
// @ts-nocheck
import {Contractor} from "@5_entities/contractor/model/model.ts";
import {POST} from "@6_shared/api";

export const addNewContractor = async (
  contractorData: Omit<Contractor, "id" | "data_created">
): Promise<Contractor> => {
  const response = await POST('/api/v0/contractor/',{
    body: contractorData,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: пустой ответ от сервера");
  }

  return response.data;
}