import {User} from "@5_entities/user";
import {GET} from "@6_shared/api";

export const getCurrentUser = async (): Promise<User> => {
  const response = await GET("/api/v0/current-user/"); // Указываем тип User для GET

  if (!response.data) {
    throw new Error("No user data received");
  }

  return response.data;
}