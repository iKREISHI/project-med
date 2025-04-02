// @ts-nocheck
import { POST } from "@6_shared/api";
import { BookingAppointment } from "../model/model";

export const addBookingAppointment = async (
    receptionData: BookingAppointment
): Promise<void> => {
    try{
        await POST('/api/v0/booking-appointments/', {
            body: receptionData
        });
    } catch(error){
        console.error(error);
    }
}