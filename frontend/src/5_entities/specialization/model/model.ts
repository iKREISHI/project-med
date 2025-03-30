import { components } from "@6_shared/api/types.ts";

export type Specialization = components["schemas"]["Specialization"];
export type PaginatedSpecializationList = components["schemas"]["PaginatedSpecializationList"];

export interface SpecializationListQueryParams {
  page?: number;
  page_size?: number;
}