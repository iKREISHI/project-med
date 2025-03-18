import { POST } from "../../../6_shared/api";
import type { LoginModel } from "../../../5_entities/user";

// Обновленный интерфейс для ответа сервера
export interface AuthResponse {
  id: number;
  username: string;
  position_id: string;
  position_name: string;
}

// Метод для авторизации врача
export const login = async (credentials: LoginModel): Promise<AuthResponse> => {
  const response = await POST("/api/v0/login/", {
    body: credentials,
  });

  if (!response || !response.data) {
    throw new Error("Ошибка: сервер вернул пустой ответ");
  }

  return response.data as AuthResponse;
};
