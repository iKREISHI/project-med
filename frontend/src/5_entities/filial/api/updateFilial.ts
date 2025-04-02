// @ts-nocheck
// @ts-nocheck
import {PUT} from "@6_shared/api";
import { Filial } from '../model/model.ts'


export const updateFilial = async (
  filialId: number,
  filialData: Omit<Filial, 'id' | 'date_created'>
): Promise<Filial> => {
  const response = await PUT('/api/v0/filial/{id}/', {
    params: {
      path:{
        id:filialId,
      }
    },
    body: filialData,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }
  return response.data as Filial;
}