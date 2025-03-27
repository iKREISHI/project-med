import { useEffect, useState } from 'react';
import { GET } from '@6_shared/api';
import { useUserId } from "@6_shared/store/useAuthStore.ts"
import type { ChatRoom } from "../model/model.ts"

export const useUserChatRooms = () => {
  const userId = useUserId();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!userId) {
        console.warn("❗ userId не найден, чаты не загружаются");
        return;
      }

      setLoading(true);

      try {
        const response = await GET("/api/v0/chat/rooms/");


        if (response.data && Array.isArray(response.data)) {
          const filteredRooms = response.data.filter((room: ChatRoom) =>
            room.participants?.includes(userId) // ✅ Исправлено с participant_ids на participants
          );

          console.log("📌 Доступные чаты для пользователя:", filteredRooms);

          setRooms(response.data);
        } else {
          console.error("❌ Ошибка: API вернуло неожиданный формат данных", response);
        }
      } catch (error) {
        console.error("❌ Ошибка при загрузке чатов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, [userId]);

  return { rooms, loading };
};
