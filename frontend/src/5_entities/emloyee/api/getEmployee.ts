// @ts-nocheck
import {GET} from "@6_shared/api";

export const getEmployee = async (employeeId: number) => {
  const response = await GET('/api/v0/employee/{id}/', {
    params:{
      path:{
        id:employeeId,
      },
    },
  });

  return response.data;
}