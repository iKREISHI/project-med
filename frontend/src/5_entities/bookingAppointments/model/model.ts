import {components} from '6_shared/api/types'

export type BookingAppointment = components['schemas']['BookingAppointment'];
//export type PaginatedReceptionTimeList = components['schemas']['PaginatedBookingAppointment'];

export interface ReceptionTimeListParams{
    page: number,
    page_size: number
}