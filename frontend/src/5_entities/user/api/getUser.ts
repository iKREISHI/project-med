import {GET} from "../../../6_shared/api";
import {User} from "../model/model.ts";
// Получение данных пользователя по ID
export const getUsers = async (): Promise<User[]> => {
    const { data, error } = await GET("/users");
    if (error) {
        throw new Error(error.message);
    }
    return data;
};
