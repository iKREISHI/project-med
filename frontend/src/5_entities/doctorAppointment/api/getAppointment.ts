import { GET } from '@6_shared/api';
import { DoctorAppointment } from "@5_entities/doctorAppointment/model/model.ts";

export const getAppointment = async (appointmentId: number): Promise<DoctorAppointment> => {
  const response = await GET("/api/v0/appointments/{id}/",{
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