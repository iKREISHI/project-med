// @ts-nocheck
import { components } from '@6_shared/api/types.ts'

export type Contractor = components['schemas']['Contractor']
export type PaginatedContractorList = components['schemas']['PaginatedContractorList']

export interface ContractorListQueryParams {
  page?: number;
  page_size?: number;
}