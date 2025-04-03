import { GET } from "@6_shared/api";

export const getNotification = async (notificationId: number): Promise<Notification> => {
    const response = await GET("/api/v0/notification/{id}/", {
        params: {
            path: { id: notificationId },
        }
    });

    if (!response.data) {
        throw new Error("Уведомление не найдено");
    }
    console.log(response.data);
    return response.data;
};
