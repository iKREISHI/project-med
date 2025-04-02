// @ts-nocheck
import {DELETE} from "@6_shared/api";

export const deleteContractor = async (contractorId: number) => {
  await DELETE('/api/v0/contractor/{id}/', {
    params:{
      path:{
        id:contractorId
      },
    }
  });
}