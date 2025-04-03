import { GET } from "@6_shared/api";
import { Laboratory } from "../model/model";

export const getNotification = async (laboratoryId: number): Promise<Laboratory> => {
    const response = await GET("/api/v0/laboratory/{id}/", {
        params: {
            path: { id: laboratoryId },
        }
    });

    if (!response.data) {
        throw new Error("Уведомление не найдено");
    }
    console.log(response.data);
    return response.data;
};
