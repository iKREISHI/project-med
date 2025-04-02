// @ts-nocheck
// @ts-nocheck
import { POST } from "@6_shared/api";
import { ReceptionTime } from "../model/model";

export const addReceptionTime = async (
    receptionData: ReceptionTime
): Promise<void> => {
    try{
        await POST('/api/v0/reception-time/', {
            body: receptionData
        });
    } catch(error){
        console.error(error);
    }
}