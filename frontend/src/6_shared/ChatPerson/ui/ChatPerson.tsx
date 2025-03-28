import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id && !hasFetchedHistory) {
      fetchMessages(parseInt(id));
      setHasFetchedHistory(true);
    }
  }, [id, hasFetchedHistory, fetchMessages]);

  useEffect(() => {
    return () => {
      setHasFetchedHistory(false);
    };
  }, [id]);

  const mergedMessages = useMemo(() => {
    const combined = [...restMessages, ...wsMessages];
    return combined
      .filter(
        (msg, index, self) =>
          index === self.findIndex(m =>
            (m.id && msg.id && m.id === msg.id) ||
            (!m.id && !msg.id && m.timestamp === msg.timestamp)
          )
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [restMessages, wsMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [mergedMessages]);

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
      {/* Шапка чата */}
      <Box sx={{
        p: 2,
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        backgroundColor: "background.paper",
        boxShadow: 1,
        zIndex: 1
      }}>
        {onBack && (
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Box sx={{ flexGrow: 1 }}>
          <span style={{ fontWeight: 500 }}>Чат #{id}</span>
          {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
        </Box>
        {!isConnected && (
          <span style={{
            color: 'orange',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            <span style={{
              width: 10,
              height: 10,
              background: 'orange',
              borderRadius: '50%',
              display: 'inline-block'
            }} />
            Соединение...
          </span>
        )}
      </Box>

      {/* Область сообщений */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: 'grey.100'
        }}
      >
        {error && (
          <Box sx={{
            p: 2,
            backgroundColor: 'error.light',
            color: 'error.contrastText',
            borderRadius: 2
          }}>
            {error}
          </Box>
        )}

        {mergedMessages.map((msg) => (
          <Box key={`${msg.id || 'msg'}_${msg.timestamp}`}
               sx={{
                 p: 2,
                 borderRadius: 4,
                 maxWidth: { xs: '90%', sm: '75%' },
                 width: "fit-content",
                 alignSelf: msg.fromCurrentUser ? "flex-end" : "flex-start",
                 bgcolor: msg.fromCurrentUser ? "primary.main" : "background.paper",
                 color: msg.fromCurrentUser ? "primary.contrastText" : "text.primary",
                 boxShadow: 2,
                 wordBreak: "break-word",
               }}>
            {msg.content}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Поле ввода сообщения - теперь всегда видимо */}
      <Box sx={{ p: 2, borderTop: "1px solid #ddd", backgroundColor: "background.paper" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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