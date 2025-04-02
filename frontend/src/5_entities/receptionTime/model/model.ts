import {components} from '6_shared/api/types'

export type ReceptionTime = components['schemas']['ReceptionTime'];
export type PaginatedReceptionTimeList = components['schemas']['PaginatedReceptionTimeList'];

export interface ReceptionTimeListParams{
    page: number,
    page_size: number
}