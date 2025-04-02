// @ts-nocheck
// @ts-nocheck
import {FilialDepartament} from "@5_entities/departament";
import {GET} from "@6_shared/api";

export const getAllDepartaments = async (): Promise<FilialDepartament[]> => {
  const response = await GET('/api/v0/filial-departments/')
  if (!response.data){
    throw new Error('Ошибка получения департаментов!')
  }
  return response.data
}