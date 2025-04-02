// @ts-nocheck
// @ts-nocheck
import { POST } from "../../../6_shared/api";
import type { LoginModel } from "../../../5_entities/user";
import type { AuthResponse } from "../../../5_entities/auth";

// Функция для авторизации пользователя
export const login = async (credentials: LoginModel): Promise<AuthResponse> => {
  try {
    const response = await POST("/api/v0/login/", {
      body: credentials,
    });

    if (!response || !response.data) {
      throw new Error("Ошибка: сервер вернул пустой ответ");
    }

    console.log("Ответ от сервера:", response.data);
    return response.data as AuthResponse;
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    throw new Error("Не удалось выполнить вход");
  }
};
