import { GET } from "@6_shared/api";
import { PaginatedReceptionTimeList, ReceptionTimeListParams } from "../model/model";

export const getAllReceptionTime = async (
    params: ReceptionTimeListParams
): Promise<PaginatedReceptionTimeList> => {
    try {
        const response = await GET('/api/v0/reception-time/', {
            query: params
        });

        if (!response.data) {
            throw new Error('Response data is empty');
        }
        return response.data as PaginatedReceptionTimeList;
        
    } catch (error) {
        console.error('Error fetching reception times:', error);
        throw error; 
    }
}