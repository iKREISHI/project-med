import { useState } from "react";
import {login} from "../api/login.ts";
import {LoginModel} from "../../../5_entities/user";
import {serviceworker} from "globals";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const creditials= {'user', '123'};
  const handleLogin = async ( credentials: LoginModel) => {
    try{
      const {username, password}  = await  login(credentials);
      localStorage.setItem("token", username, password);
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);

    }
  };
  const logout = async () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }

  //return {isAuthenticated, handleLogin, logout};

}