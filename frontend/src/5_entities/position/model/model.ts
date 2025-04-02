// @ts-nocheck
// @ts-nocheck
import { components } from "@6_shared/api/types.ts";

export type Position = components["schemas"]["Position"];
export type PaginatedPositionList = components["schemas"]["PaginatedPositionList"];

export interface PositionListQueryParams {
  page?: number;
  page_size?: number;
}