import { components } from "@6_shared/api/types.ts";

// Модель уведомления
export type Notification = components["schemas"]["Notification"];
// Модель списка уведомлений с пагинацией
export type PaginatedNotificationList = components["schemas"]["PaginatedNotificationList"];

// Модель для запроса списка уведомлений
export interface NotificationListQueryParams {
  page?: number;
  page_size?: number;
}