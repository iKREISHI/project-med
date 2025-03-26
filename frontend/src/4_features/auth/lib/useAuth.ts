import { useState } from "react";
import { login } from "../api/login.ts";
import { logoutRequest } from "../api/logout.ts";
import type { LoginModel } from "@5_entities/user";
import type { AuthResponse } from "@5_entities/auth";
import {useNavigate} from "react-router-dom";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<AuthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (credentials: LoginModel) => {
    try {
      const response = await login(credentials);

      if (response.user_id) {
        localStorage.setItem("user", JSON.stringify(response));
        setUserData(response);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        throw new Error(response.detail || "Authentication failed");
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      console.error("Ошибка при входе:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      setUserData(null);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      console.error(error);
    }
  };

  // Геттер для user_id
  const userId = userData?.user_id || JSON.parse(localStorage.getItem("user") || "{}")?.user_id || null;

  return { isAuthenticated, userId, userData, error, handleLogin, handleLogout };
};
