import { POST } from "../../../6_shared/api";
import type { Login } from "../../../5_entities/user/model/model.ts";

export const login = async (credentials: Login) => {
  const { data } = await POST("/api/v0/login/", {
    body: credentials,
  });
  return data;
}