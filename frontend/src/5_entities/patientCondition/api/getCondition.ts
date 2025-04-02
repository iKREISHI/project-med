// @ts-nocheck
import { GET } from "@6_shared/api";
import { PatientCondition } from "../model/model";

//Получение одного СОСТОЯНИЕ по его id
export const getCondition = async (conditionId: number): Promise<PatientCondition> => {
  const response = await GET("/api/v0/patient-conditions/{id}/", {
    params: {
      path: { id: conditionId },
      query: undefined,
      header: undefined,
      cookie: undefined
    }
  });

  if (!response.data) {
    throw new Error("Состояние не найден");
  }
  console.log(response.data);
  return response.data as PatientCondition;
};