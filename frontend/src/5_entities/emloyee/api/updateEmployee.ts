// @ts-nocheck
import { PUT } from "@6_shared/api";
import {Patient} from "@5_entities/patient";

export const updateEmployee = async (
  employeeId: number,
  employeeData: Omit<Patient, 'id' | 'date_created'>
): Promise<void> => {
  const response = await PUT('/api/v0/employee/{id}/',{
    params:{
      path:{
        id: employeeId,
      }
    },
    body: employeeData,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }
}