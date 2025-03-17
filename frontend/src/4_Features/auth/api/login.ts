import { POST } from "../../../6_shared/api";
import type { LoginModel } from "../../../5_entities/user/";

export const login = async (credentials: LoginModel) => {
  const { data } = await POST("/api/v0/login/", {
    body: credentials,
  });
  return data;
}