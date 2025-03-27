import { components } from "@6_shared/api/types.ts";

export type Filial = components['schemas']['Filial'];
export type PaginatedFilialList = components['schemas']['PaginatedFilialList'];

export interface FilialListQueryParams {
  page?: number;
  page_size?: number;
}