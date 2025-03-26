import { useState, useEffect, useCallback } from "react";

export const useChatWebSocket = (chatId: string | null) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const sendMessage = useCallback((message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      // Оптимистичное обновление
      setMessages(prev => [...prev, {
        ...message,
        fromCurrentUser: true,
        status: 'sending',
        timestamp: new Date().toISOString()
      }]);

      // Отправка через WebSocket
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  useEffect(() => {
    if (!chatId) return;

    const wsUrl = `ws://127.0.0.1:8000/ws/chat/${chatId}/`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      setSocket(ws);
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, {
          ...message,
          fromCurrentUser: message.sender_id === "current_user_id", // Используйте актуальное поле из вашего API
          status: 'delivered',
          timestamp: message.timestamp || new Date().toISOString()
        }]);
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      setIsConnected(false);
      setSocket(null);
      setMessages(prev => prev.map(msg =>
        msg.status === 'sending' ? {...msg, status: 'failed'} : msg
      ));
      console.log('WebSocket disconnected');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [chatId]);

  return {
    messages: messages.filter(msg => msg.status !== 'failed'), // Показываем даже отправляющиеся сообщения
    sendMessage,
    isConnected
  };
};