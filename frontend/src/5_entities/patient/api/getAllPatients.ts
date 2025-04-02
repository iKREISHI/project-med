import { GET } from "@6_shared/api";
import type {PaginatedPatientList, PatientListQueryParams} from "../../patient";

//Получение списка всех пациентов с поддержкой пагинации 
export const getAllPatients = async (
  params?: PatientListQueryParams
): Promise<PaginatedPatientList> => {
  console.log('Request params:', params);
  const response = await GET("/api/v0/patient/", { 
    params: {
      query: params 
    } 
  });
  console.log('Response data:', response.data);
  if (!response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }
  return response.data;
};