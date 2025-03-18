import { POST } from "../../../6_shared/api";
import type { LoginModel } from "../../../5_entities/user/";

//Метод для авторизации врача
export const login = async (credentials: LoginModel) => {
  const { data } = await POST("/api/v0/login/", {
    body: credentials,
  });
  return data;
}