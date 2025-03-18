import { useState } from "react";
import { login } from '../api/login.ts';
import { logout } from '../api/logout.ts';
import { LoginModel } from "../../../5_entities/user";

export interface AuthResponse {
  detail: string;
  user_uuid: string;
  position_uuid:string;
  position:string;
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<AuthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginModel) => {
    try {
      const response: AuthResponse = await login(credentials);
      localStorage.setItem("user_uuid", response.user_uuid);
    }
  }
}