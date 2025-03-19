import { GET } from "../../../6_shared/api";
import type {PaginatedPatientList, PatientListQueryParams} from "../../patient";

export const getAllPatients = async (
  params: PatientListQueryParams = {}
): Promise<PaginatedPatientList> => {
  // Отправляем GET-запрос, передавая параметры в query
  const response = await GET("/api/v0/patient/", {
    query: params,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }

  return response.data as PaginatedPatientList;
};