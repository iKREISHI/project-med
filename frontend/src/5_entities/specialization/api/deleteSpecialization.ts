import { DELETE } from "@6_shared/api";

export const deleteSpecialization = async (
  specializationId: number
): Promise<void> => {
  try {
    const response = await DELETE('/api/v0/specialization/{id}/', {
      params: {
        path: {
          id: specializationId,
        },
      },
    });

    console.log('Полный ответ от сервера:', response);

    // Проверяем статус ответа
    if (response.response.status === 204) {
      return; 
    }
    throw new Error(`Сервер вернул статус: ${response.response.status}`);
  } catch (error: any) {
    console.error('Ошибка в deleteSpecialization:', {
      error,
      message: error.message,
      stack: error.stack,
    });

    throw new Error(
      error.message || 'Произошла неизвестная ошибка при удалении'
    );
  }
};