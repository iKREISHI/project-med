import { GET } from "@6_shared/api";
import type {PaginatedDoctorAppointmentList, DoctorAppointmentQueryParams} from "@5_entities/doctorAppointment/model/model.ts";

//Получение списка всех ПРИЕМОВ с поддержкой пагинации
export const getAllAppointments = async (
  params: DoctorAppointmentQueryParams = {}
): Promise<PaginatedDoctorAppointmentList> =>{
  const response = await GET("/api/v0/appointments/",{
    query: params,
  });

  if (!response || !response.data){
    throw new Error("Not Found");
  }

  return response.data;
}