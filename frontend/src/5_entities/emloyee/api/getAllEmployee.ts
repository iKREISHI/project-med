// @ts-nocheck
// @ts-nocheck
import {type PatientListQueryParams} from "@5_entities/patient";
import {PaginatedEmployeeList} from "@5_entities/emloyee/model/model.ts";
import {GET} from "@6_shared/api";

export const getAllEmployee = async (
  queryParams: PatientListQueryParams
) :Promise<PaginatedEmployeeList> => {
  const response = await GET('/api/v0/employee/', {
    query: queryParams,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }

  return response.data;
}