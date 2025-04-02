// @ts-nocheck
// useChatWebSocket.ts
import { useState, useEffect, useCallback, useRef } from "react";
import {websocketBaseUrl} from '@6_shared/config/backend.ts'

export const useChatWebSocket = (chatId: string | null) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null); // Используем ref вместо state

  const createSocket = useCallback((url: string) => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, {
          ...message,
          fromCurrentUser: message.sender_id === "current_user_id",
          status: 'delivered',
          timestamp: message.timestamp || new Date().toISOString()
        }]);
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      console.log('WebSocket closed', event.reason);
    };

    return ws;
  }, []);

  useEffect(() => {
    if (!chatId) return;

    const wsUrl = `ws://${websocketBaseUrl}/ws/chat/${chatId}/`;
    socketRef.current = createSocket(wsUrl);

    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close(1000, 'Component unmounted');
      }
    };
  }, [chatId, createSocket]);

  const sendMessage = useCallback((message: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const tempId = Date.now();
      setMessages(prev => [...prev, {
        ...message,
        id: tempId,
        fromCurrentUser: true,
        status: 'sending'
      }]);

      socketRef.current.send(JSON.stringify(message));
    }
  }, []);

  return {
    messages: messages.filter(msg => msg.status !== 'failed'),
    sendMessage,
    isConnected
  };
};