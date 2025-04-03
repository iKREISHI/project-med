import { components } from "@6_shared/api/types.ts";

export type LabResearch = components["schemas"]["LabResearch"];
export type PaginatedLabResearchList = components["schemas"]["PaginatedLabResearchList"];

export interface LabResearchListQueryParams {
  page?: number;
  page_size?: number;
  status?: string;
  is_priority?: boolean;
  patient?: number;
  laboratory?: number;
}