import { components } from "../../../6_shared/api/types.ts";


//Модель пациента
export type Patient = components["schemas"]["Patient"];
//Модель списка пациентов
export type PaginatedPatientList = components["schemas"]["PaginatedPatientList"];


//Модель для запроса списка пациентов
export interface PatientListQueryParams {
  page?: number;
  page_size?: number;
}