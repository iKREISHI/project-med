// @ts-nocheck
import {DoctorAppointment} from "@5_entities/doctorAppointment/model/model.ts";
import {POST} from "@6_shared/api";

export const addAppointments = async (
  params: DoctorAppointment
) => {
  const response = await POST('/api/v0/appointments/', {
    body: params
  })
  return response.data;
}