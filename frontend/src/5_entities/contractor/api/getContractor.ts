// @ts-nocheck
// @ts-nocheck
import {Contractor} from "@5_entities/contractor/model/model.ts";
import {GET} from "@6_shared/api";

//Получение РАБОТОДАТЕЛЯ по ID
export const getContractor = async (contractorId: number): Promise<Contractor> => {
  const response = await GET('/api/v0/contractor/{id}/', {
    params:{
      path:{
        id: contractorId
      },
    }
  })
  return response.data as Contractor
}
