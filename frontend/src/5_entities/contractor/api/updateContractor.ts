import {Contractor} from "@5_entities/contractor/model/model.ts";
import {PUT} from "@6_shared/api";


export const updateContractor = async (
  contractorId: number,
  contractorData: Omit<Contractor, "id" | "date_created">
): Promise<void> => {
  const response = await PUT('/api/v0/contractor/{id}/',{
    params: {
      path:{
        id: contractorId,
      },
    },
    body: contractorData,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }
}