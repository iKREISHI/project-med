// @ts-nocheck
import { GET } from "@6_shared/api";
import { BookingAppointmentListParams } from "../model/model";

export const getAllBokkingAppointments = async (
    params: BookingAppointmentListParams 
) => {
    const response = await GET('/api/v0/booking-appointments/', {
        query:params,
    });
    
    if (!response || !response.data) {
        throw new Error("Ошибка: сервер вернул пустой ответ");
      }
    
      return response.data;
}