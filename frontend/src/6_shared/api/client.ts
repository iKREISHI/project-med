import createClient from "openapi-fetch";
import type { paths } from "./types";
import { backendBaseUrl } from "../config";

export const { GET, POST, PUT, DELETE } = createClient<paths>({
  baseUrl: backendBaseUrl,
  fetch: (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
    const token = localStorage.getItem("accessToken"); // Или sessionStorage
    return fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include", // Добавляет куки в запросы
    });
  },
});
