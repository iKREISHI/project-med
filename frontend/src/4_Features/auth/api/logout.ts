import { POST } from "../../../6_shared/api";

// Метод для выхода из системы
export const logoutRequest = async () => {
  try {
    await POST("/api/v0/logout/");
  } catch (error) {
    console.error("Ошибка при выходе:", error);
  }
};
