// @ts-nocheck
import {components} from '6_shared/api/types'

export type BookingAppointment = components['schemas']['BookingAppointment'];
//export type PaginatedReceptionTimeList = components['schemas']['PaginatedBookingAppointment'];

export interface BookingAppointmentListParams{
    start_date: string,
    end_date: string,
    page: number,
    page_size: number
}