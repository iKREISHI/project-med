// @ts-nocheck
// @ts-nocheck
import {PaginatedContractorList, ContractorListQueryParams} from "@5_entities/contractor/model/model.ts";
import {GET} from "@6_shared/api";


export const getAllContractors = async (
  params: ContractorListQueryParams = {}
): Promise<PaginatedContractorList> => {
  const response = await GET('/api/v0/contractor/',{
    query: params,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ")
  }

  return response.data as PaginatedContractorList;
}