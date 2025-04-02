import { GET } from "@6_shared/api";
import { NotificationListQueryParams, PaginatedNotificationList } from "../model/model";

export const getAllNotifications = async (
    params?: NotificationListQueryParams
): Promise<PaginatedNotificationList> => {
    console.log('Notification request params:', params);
    const response = await GET("/api/v0/notification/", {
        params: {
            query: params
        }
    });
    console.log('Notification response data:', response.data);
    if (!response.data) {
        throw new Error("Ошибка: сервер вернул пустой ответ");
    }
    return response.data;
};