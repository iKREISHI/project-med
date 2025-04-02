// @ts-nocheck
import { components } from "@6_shared/api/types.ts";

//Модель ПРИЕМА паицента у врача
export type DoctorAppointment = components['schemas']['DoctorAppointment'];
export type PaginatedDoctorAppointmentList = components["schemas"]["PaginatedDoctorAppointmentList"];

//Модель для тела запроса получения списка
export interface DoctorAppointmentQueryParams {
  page?: number;
  page_size?: number;
}