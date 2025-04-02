// @ts-nocheck
// @ts-nocheck
import {FilialListQueryParams, PaginatedFilialList} from "@5_entities/filial/model/model.ts";
import { GET } from "@6_shared/api";



export const getAllFilials =  async (
  params: FilialListQueryParams = {}
):Promise<PaginatedFilialList> => {
  const response = await GET('/api/v0/filial/',{
    query:params,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }

  return response.data;
}