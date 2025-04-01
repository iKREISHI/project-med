import { DELETE } from "@6_shared/api";

export const deleteDepartaments = async (
    departamentsId: number
): Promise<void> => {
    try {
        const response = await DELETE('/api/v0/filial-departments/{id}/', {
            params: {
                path: {
                    id: departamentsId,
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
        console.error('Ошибка в deleteDepartaments:', {
            error,
            message: error.message,
            stack: error.stack,
        });

        throw new Error(
            error.message || 'Произошла неизвестная ошибка при удалении филиала'
        );
    }
};