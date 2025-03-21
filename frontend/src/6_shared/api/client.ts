import createClient from "openapi-fetch";
import type { paths } from "./types";
import { backendBaseUrl } from "../config";

export const { GET, POST, PUT, DELETE } = createClient<paths>({
  baseUrl: backendBaseUrl,
  fetch: (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
    // Берём токен из localStorage под ключом "sessionStorage"
    const token = localStorage.getItem("sessionStorage");
    console.log('TOKEN =  ', token);
    return fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        // Если сервер ожидает Bearer токен, иначе можно вернуть Cookie
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include", // Добавляем куки в запросы
    });
  },
});
