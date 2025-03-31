// useCreateChatRoom.ts
import { useState } from "react";
import { POST } from "@6_shared/api";

export const useCreateChatRoom = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRoom = async (data: {
    name: string;
    participant_ids: number[];
    room_type: "private" | "group";
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await POST('/api/v0/chat/rooms/', {
        body: data,
        params: {
          path: undefined,
          query: undefined,
          header: undefined,
          cookie: undefined
        }
      });

      return response.data;
    } catch (err) {
      console.error("Ошибка создания чата:", err);
      setError("Не удалось создать чат");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createRoom, loading, error };
};