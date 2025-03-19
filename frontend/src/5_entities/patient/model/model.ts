import { components } from "../../../6_shared/api/types.ts";

export type Patient = components["schemas"]["Patient"];
export type PaginatedPatientList = components["schemas"]["PaginatedPatientList"];
export interface PatientListQueryParams {
  page?: number;
  page_size?: number;
}