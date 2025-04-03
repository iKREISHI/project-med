import { components } from "@6_shared/api/types.ts";

export type MedicalCard = components['schemas']['MedicalCard'];
export type PaginatedMedicalCardList = components['schemas']['PaginatedMedicalCardList'];

export interface MedicalCardListQueryParams {
  page?: number;
  page_size?: number;
}