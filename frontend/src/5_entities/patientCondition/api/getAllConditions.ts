// @ts-nocheck
import { GET } from "@6_shared/api";
import type {PaginatedPatientList, PatientListQueryParams} from "../../patient";
import { PaginatedPatientCondition, PatientConditionParams } from "../model/model";

//Получение списка всех пациентов с поддержкой пагинации
export const getAllConditions = async (
  params: PatientConditionParams = {}
): Promise<PaginatedPatientCondition> => {
  // Отправляем GET-запрос, передавая параметры в query
  const response = await GET("/api/v0/patient-conditions/", {
    query: params,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }

  return response.data as PaginatedPatientCondition;
};