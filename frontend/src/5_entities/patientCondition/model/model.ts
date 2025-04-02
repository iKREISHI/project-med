// @ts-nocheck
import { components } from "@6_shared/api/types";

export type PatientCondition = components['schemas']['PatientCondition'];
export type PaginatedPatientCondition = components['schemas']['PaginatedPatientConditionList'];

export interface PatientConditionParams{
    page: number,
    page_size: number,
}