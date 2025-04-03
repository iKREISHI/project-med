import { GET } from "@6_shared/api";
import { LabResearchListQueryParams, PaginatedLabResearchList } from "../model/model";

// Получение списка всех направлений в лабораторию с поддержкой пагинации
export const getAllLaboratoryResearch = async (
  params: LabResearchListQueryParams = {}
): Promise<PaginatedLabResearchList> => {
  const response = await GET("/api/v0/laboratory-research/", {
    params: {
      query: params
    }
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }

  return response.data as PaginatedLabResearchList;
};