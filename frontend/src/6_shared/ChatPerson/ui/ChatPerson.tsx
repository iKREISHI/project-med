import React, { useState, useEffect, useMemo, useRef } from "react";
import { Box, TextField, Button, CircularProgress } from "@mui/material";
import { useChatWebSocket } from "@5_entities/chat/";
import { useChatMessages } from "@5_entities/chat/";

interface ChatPersonProps {
  id: string;
}

const MessageItem = ({ message }: { message: any }) => (
  <Box sx={{
    p: 2,
    borderRadius: 4,
    maxWidth: '75%',
    width: "fit-content",
    alignSelf: message.fromCurrentUser ? "flex-end" : "flex-start",
    bgcolor: message.fromCurrentUser
      ? (message.status === 'sending' ? 'grey.300' : 'primary.main')
      : 'background.paper',
    color: message.fromCurrentUser ? 'primary.contrastText' : 'text.primary',
    boxShadow: 2,
    position: 'relative',
    transition: 'background-color 0.3s ease'
  }}>
    {message.content}
    {message.status === 'sending' && (
      <CircularProgress
        size={16}
        sx={{ position: 'absolute', right: 8, bottom: 8 }}
      />
    )}
  </Box>
);

export const ChatPerson: React.FC<ChatPersonProps> = ({ id }) => {
  const { messages: wsMessages, sendMessage, isConnected } = useChatWebSocket(id);
  const { messages: restMessages, fetchMessages, loading, error } = useChatMessages();
  const [newMessage, setNewMessage] = useState("");
  const [hasFetchedHistory, setHasFetchedHistory] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id && !hasFetchedHistory) {
      fetchMessages(parseInt(id));
      setHasFetchedHistory(true);
    }
  }, [id, hasFetchedHistory, fetchMessages]);

  const mergedMessages = useMemo(() => {
    const combined = [...restMessages, ...wsMessages];
    return combined
      .filter((msg, index, self) =>
        self.findIndex(m =>
          (m.id && msg.id && m.id === msg.id) ||
          m.timestamp === msg.timestamp
        ) === index
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [restMessages, wsMessages]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [mergedMessages.length]);

  const handleSend = () => {
    if (newMessage.trim() && isConnected) {
      sendMessage({
        message_type: "text",
        content: newMessage,
        timestamp: new Date().toISOString()
      });
      setNewMessage("");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{
        p: 2,
        borderBottom: "1px solid #ddd",
        bgcolor: "background.paper",
        boxShadow: 1,
        zIndex: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <span style={{ fontWeight: 500 }}>Чат #{id}</span>
          {loading && <CircularProgress size={20} />}
          {!isConnected && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'warning.main',
              gap: 1
            }}>
              <Box sx={{
                width: 10,
                height: 10,
                bgcolor: 'warning.main',
                borderRadius: '50%'
              }} />
              <span>Соединение...</span>
            </Box>
          )}
        </Box>
      </Box>

      <Box
        ref={messagesContainerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          bgcolor: 'grey.100'
        }}
      >
        {error && (
          <Box sx={{
            p: 2,
            bgcolor: 'error.light',
            color: 'error.contrastText',
            borderRadius: 2
          }}>
            {error}
          </Box>
        )}

        {mergedMessages.map((msg) => (
          <MessageItem key={`${msg.id}_${msg.timestamp}`} message={msg} />
        ))}
      </Box>

      <Box sx={{
        p: 2,
        borderTop: "1px solid #ddd",
        bgcolor: "background.paper",
        position: 'sticky',
        bottom: 0
      }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Написать сообщение..."
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
    </Box>
  );
};