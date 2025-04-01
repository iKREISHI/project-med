import { PUT } from "@6_shared/api";
import { FilialDepartament } from "@5_entities/departament";

//Обновление данных о Подразделениях
export const updateDepartaments = async (
    departamentId: number,
    departamentData: Omit<FilialDepartament, "id" | "date_created">
): Promise<void> => {
    const response = await PUT('/api/v0/filial-departments/{id}/', {
        params: {
            path: { id: departamentId },
            query: undefined,
            header: undefined,
            cookie: undefined
        },
        body: departamentData,
    });

    if (!response || !response.data) {
        throw new Error("Ошибка: сервер вернул пустой ответ");
    }
};