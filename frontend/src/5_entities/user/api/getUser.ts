import {GET} from "../../../6_shared/api";
import {User} from "../model/model.ts";

// Получение данных пользователя по ID
export const getUser = async (
    userId: number
 ): Promise<User> => {
    const response = await GET("/api/v0/users/{id}/", {
        params: {
            path:{
                id: userId
            }
        }
    });
    
    if (!response){
        console.log('Ошибка получения пользователя')
        
    }
    return response.data;
};
