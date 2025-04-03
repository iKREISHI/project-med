import { components } from "@6_shared/api/types.ts";

export type Laboratory = components["schemas"]["Laboratory"];
export type PaginatedLaboratoryList = components["schemas"]["PaginatedLaboratoryList"];

export interface LaboratoryListQueryParams {
  page?: number;
  page_size?: number;
}