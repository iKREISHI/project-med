// @ts-nocheck
import { create } from "zustand";

interface AuthState {
  userId: number | null;
  positionId: number | null;
  position: string | null;
  isAuthenticated: boolean;
  setAuth: (user: { user_id: number; position_id: number; position: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Загружаем данные из localStorage при инициализации
  const savedUser = localStorage.getItem("user");
  const parsedUser = savedUser ? JSON.parse(savedUser) : null;

  return {
    userId: parsedUser?.user_id || null,
    positionId: parsedUser?.position_id || null,
    position: parsedUser?.position || null,
    isAuthenticated: Boolean(parsedUser?.user_id),

    setAuth: (user) => {
      localStorage.setItem("user", JSON.stringify(user));
      set({
        userId: user.user_id,
        positionId: user.position_id,
        position: user.position,
        isAuthenticated: true,
      });
    },

    logout: () => {
      localStorage.removeItem("user");
      set({ userId: null, positionId: null, position: null, isAuthenticated: false });
    },
  };
});

// Хуки для получения данных
export const useUserId = () => useAuthStore((state) => state.userId);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
