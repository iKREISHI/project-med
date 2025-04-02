// @ts-nocheck
// @ts-nocheck
import { PUT } from '@6_shared/api';
import { DoctorAppointment } from "@5_entities/doctorAppointment/model/model.ts";

//Удаление ЗАПИСИ ПРИЕМА
export const deleteAppointment = async (
  appointmentId: number,
  appointmentData: Omit<DoctorAppointment, any>
): Promise<DoctorAppointment> => {
  const response = await PUT("/api/v0/appointments/{id}/",{
    params: {
      path: { id: appointmentId},
      query: undefined,
      header: undefined,
      cookie: undefined
    },
    body:  appointmentData,
  });

  if (!response.data){
    throw new Error("Прием не найден");
  }
  console.log(response.data);
  return response.data;
}