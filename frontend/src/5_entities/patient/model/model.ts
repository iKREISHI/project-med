import { components } from "../../../6_shared/api/types.ts";


//Модель пациента
export type Patient = components["schemas"]["Patient"];

export type NewPatient = {
  place_of_work: string;
  last_name:string;
  first_name:string;
  patronomyc:string;
  gender: components['schemas']['GenderEnum'];
  date_of_birth: string;
  snils: string;
  inn: string;
  photo: string;
  registration_address: string;
  actual_address: string;
  email: string;
  phone:string;
  additional_place_of_work: string;
  profession:string;
  registered_by:number;
  contractor:number;
  legal_representave:number;

};

//Модель списка пациентов
export type PaginatedPatientList = components["schemas"]["PaginatedPatientList"];


//Модель для запроса списка пациентов
export interface PatientListQueryParams {
  page?: number;
  page_size?: number;
}