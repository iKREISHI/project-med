import {DELETE} from "@6_shared/api";

export const deleteFilial = async (
  filialId: number,
):Promise<void> => {
  const response = await DELETE('/api/v0/filial/{id}/',{
    params:{
      path:{
        id: filialId,
      },
    },
  });
  if (response.error === 404) {
    throw new Error("Пациент не найден");
  }

  if (response.error !== 204) {
    throw new Error(`Неожиданный статус ответа: ${response.error}`);
  }

}