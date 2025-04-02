// @ts-nocheck
// @ts-nocheck
import { components } from "../../../6_shared/api/types.ts";

//Модель сотрудника
export type Employee = components["schemas"]["Employee"];
//Модель для списка сотрудников
export type PaginatedEmployeeList = components["schemas"]["PaginatedEmployeeList"];

export interface EmloyeeListQueryParams {
  page?: number;
  page_size?: number;
}