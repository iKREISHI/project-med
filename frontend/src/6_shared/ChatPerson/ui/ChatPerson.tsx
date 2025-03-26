import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, IconButton, TextField, Button, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useChatWebSocket } from "@5_entities/chat/";
import { useChatMessages } from "@5_entities/chat/";

interface ChatPersonProps {
  id: string;
  onBack?: () => void;
}

export const ChatPerson: React.FC<ChatPersonProps> = ({ id, onBack }) => {
  const { messages: wsMessages, sendMessage, isConnected } = useChatWebSocket(id);
  const { messages: restMessages, fetchMessages, loading, error } = useChatMessages();
  const [newMessage, setNewMessage] = useState("");
  const [hasFetchedHistory, setHasFetchedHistory] = useState(false);

  // Загружаем историю сообщений при изменении ID
  useEffect(() => {
    if (id && !hasFetchedHistory) {
      fetchMessages(parseInt(id));
      setHasFetchedHistory(true);
    }
  }, [id, hasFetchedHistory, fetchMessages]);

  // Сбрасываем флаг загрузки при смене чата
  useEffect(() => {
    setHasFetchedHistory(false);
  }, [id]);

  // Объединение сообщений с устранением дубликатов
  const mergedMessages = useMemo(() => {
    const combined = [...restMessages, ...wsMessages];
    return combined.filter(
      (msg, index, self) =>
        index === self.findIndex(m =>
          m.id === msg.id ||
          m.timestamp === msg.timestamp
        )
    );
  }, [restMessages, wsMessages]);

  const handleSend = useCallback(() => {
    if (newMessage.trim() && isConnected) {
      sendMessage({
        message_type: "text",
        content: newMessage,
        timestamp: new Date().toISOString()
      });
      setNewMessage("");
    }
  }, [newMessage, isConnected, sendMessage]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid #ddd", display: "flex", alignItems: "center" }}>
        {onBack && (
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <span>Чат {id}</span>
        {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
        {!isConnected && <span style={{ color: 'orange', marginLeft: 10 }}>(нет соединения)</span>}
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {mergedMessages.map((msg) => (
          <Box
            key={msg.id || msg.timestamp}
            sx={{
              p: 1,
              mb: 1,
              borderRadius: 2,
              bgcolor: msg.fromCurrentUser ? "#e3f2fd" : "#f5f5f5",
              alignSelf: msg.fromCurrentUser ? "flex-end" : "flex-start",
              maxWidth: "70%"
            }}
          >
            {msg.message_type === "text" && <p>{msg.content}</p>}
            <small style={{ opacity: 0.6 }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </Box>
        ))}
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid #ddd", display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Введите сообщение..."
          disabled={!isConnected}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!isConnected || !newMessage.trim()}
        >
          Отправить
        </Button>
      </Box>
    </Box>
  );
};