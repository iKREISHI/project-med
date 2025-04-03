import { components } from "@6_shared/api/types.ts";

export type MedicalCardType = components['schemas']['MedicalCardType'];
export type PaginatedMedicalCardTypeList = components['schemas']['PaginatedMedicalCardTypeList'];

export interface MedicalCardTypeListQueryParams {
  page?: number;
  page_size?: number;
}