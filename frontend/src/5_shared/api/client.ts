import createClient from "openapi-fetch";
import type { paths } from "./types"; // без .ts в импорте
import { backendBaseUrl } from "../config";

export const {GET, POST, PUT, DELETE} = createClient<paths>({
  baseUrl: backendBaseUrl,
});
