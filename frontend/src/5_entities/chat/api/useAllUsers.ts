// @ts-nocheck
// @ts-nocheck
import { User } from "@5_entities/user";
import { GET } from "@6_shared/api";
import { useEffect, useState } from "react";

export const useAllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Начало загрузки пользователей...");

        // 1. Делаем запрос
        const response = await GET("/api/v0/users/");
        console.log("Raw response:", response);

        // 2. Проверяем наличие данных (адаптируйте под ваш API)
        if (!response.data) {
          throw new Error("API не вернуло данные");
        }

        // 3. Проверяем, что это массив
        if (!Array.isArray(response.data)) {
          throw new Error("Ожидался массив пользователей");
        }

        // 4. Преобразуем данные
        const formattedUsers = response.data.map((user: any) => ({
          id: user.id,
          username: user.username,
          name: user.username, // дублируем если нужно
          position_id: user.position_id,
          position_name: user.position_name,
          avatar: user.avatar || null
        }));

        console.log("Форматированные пользователи:", formattedUsers);
        setUsers(formattedUsers);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Неизвестная ошибка";
        console.error("Полная ошибка:", err);
        setError(`Ошибка загрузки: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};