import { PUT } from "@6_shared/api";
import { Specialization } from '../model/model'; 

export const updateSpecialization = async (
  specializationId: number,
  specializationData: {
    title: string;
    description: string;
  }
): Promise<Specialization> => {
  try {
    const response = await PUT('/api/v0/specialization/{id}/', {
      params: {
        path: {
          id: specializationId,
        }
      },
      body: specializationData,
    });

    if (!response || !response.data) {
      throw new Error("Ошибка: сервер вернул пустой ответ");
    }

    return response.data as Specialization;
  } catch (error: any) {
    console.error('Ошибка при обновлении специализации:', {
      error,
      message: error.message,
      stack: error.stack,
    });
    
    throw new Error(
      error.message || 'Произошла неизвестная ошибка при обновлении специализации'
    );
  }
};