import createClient from "openapi-fetch";
import type { paths } from "./types";
import { backendBaseUrl } from "../config";

export const { GET, POST, PUT, DELETE } = createClient<paths>({
  baseUrl: backendBaseUrl,
  fetch: async (input: Request | string, init?: RequestInit): Promise<Response> => {
    return fetch(input, {
      ...init,
      credentials: "include", // Передаём sessionid автоматически
      headers: {
        ...init?.headers,
        "Content-Type": "application/json",
      },
    });
  },
});
