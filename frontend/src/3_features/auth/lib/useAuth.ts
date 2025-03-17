import {login} from "../api/login.ts";
import { LoginModel } from "../../../5_entities/user/"
import {useState} from "react";
import {User} from "../../../5_entities/user/model/model.ts";

export const  useAuth = () => {
    const [user, setUser] = useState<User | null>(null)
    const handleLogin = async (credentials: LoginModel) => {
        const data = await login(credentials);
        if (data)
        {
            setUser(data);
        }
    }
}