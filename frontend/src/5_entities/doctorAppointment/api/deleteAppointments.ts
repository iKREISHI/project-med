// @ts-nocheck
// @ts-nocheck
import { DELETE } from '@6_shared/api';
import { DoctorAppointment } from "@5_entities/doctorAppointment/model/model.ts";

//Удаление ЗАПИСИ ПРИЕМА
export const deleteAppointment = async (appointmentId: number): Promise<DoctorAppointment> => {
  const response = await DELETE("/api/v0/appointments/{id}/",{
    params: {
      path: { id: appointmentId},
      query: undefined,
      header: undefined,
      cookie: undefined
    }
  });

  if (!response.data){
    throw new Error("Прием не найден");
  }
  console.log(response.data);
  return response.data;
}