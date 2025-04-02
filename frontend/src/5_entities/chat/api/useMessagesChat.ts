// @ts-nocheck
// @ts-nocheck
import { useState } from "react";
import { ChatMessage } from "@5_entities/chat/model/model.ts";
import { GET } from "@6_shared/api";

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async (room_id: number) => {
    if (!room_id || messages.length > 0) return; // Не загружаем если уже есть сообщения


    setLoading(true);
    setError(null);

    try {
      const response = await GET('/api/v0/chat/rooms/{room_id}/messages/', {
        params: {
          path: { room_id: room_id },
          query: undefined,
          header: undefined,
          cookie: undefined
        }
      });

      if (response.data && Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        throw new Error("Неверный формат данных сообщений");
      }
    } catch (err) {
      console.error("Ошибка загрузки сообщений:", err);
      setError("Не удалось загрузить сообщения");
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    fetchMessages,
    loading,
    error,
    setMessages
  };
};