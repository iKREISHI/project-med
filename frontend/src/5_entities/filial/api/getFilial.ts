// @ts-nocheck
import {Filial} from "@5_entities/filial/model/model.ts";
import { GET } from "@6_shared/api";

export const getFilial = async (
  filialId: number,
):Promise<Filial> =>{
  const response = await GET('/api/v0/filial/{id}/',{
    params:{
      path:{
        id:filialId,
      },
    },
  });
  if (!response) {
    throw new Error("Ошибка: пустой ответ от сервера");
  }

  return response.data as Filial;
}