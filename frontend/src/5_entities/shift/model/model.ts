// @ts-nocheck
import { components } from "@6_shared/api/types.ts";

export type Shift = components["schemas"]["Shift"];
export type PaginatedShiftList = components["schemas"]["PaginatedShiftList"];
export type ShiftTransfer = components["schemas"]["ShiftTransfer"];


export interface ShiftListQueryParams {
  end_date?: string;
  page?: number;
  page_size?: number;
  start_date?:string;
}