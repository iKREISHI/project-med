import React, { useState, useEffect, useMemo, useRef } from "react";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { useChatWebSocket } from "@5_entities/chat/";
import { useChatMessages } from "@5_entities/chat/";
import { CustomButton } from "@6_shared/Button";
import { InputForm } from "@6_shared/Input";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";

interface ChatPersonProps {
  id: string;
}

const MessageItem = ({ message }: { message: any }) => (
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: message.fromCurrentUser ? 'flex-end' : 'flex-start',
    mb: 2,
    width: '100%'
  }}>

    {/* Само сообщение */}
    <Box sx={{
      p: 2,
      borderRadius: 4,
      maxWidth: '75%',
      width: "fit-content",
      bgcolor: message.fromCurrentUser
        ? (message.status === 'sending' ? 'grey.300' : 'primary.main')
        : 'background.paper',
      color: message.fromCurrentUser ? 'primary.contrastText' : 'text.primary',
      boxShadow: 2,
      position: 'relative',
      transition: 'background-color 0.3s ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Автор сообщения (только для чужих сообщений) */}
      {!message.fromCurrentUser && (
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 500
          }}
        >
          {message.sender || 'Unknown'}
        </Typography>
      )}

      {message.content}
      {message.files && (
        <Box sx={{ mt: 1 }}>
          {message.files.map((file: File, index: number) => (
            file.type.startsWith("image/") ? (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt="Uploaded"
                style={{ maxWidth: "100%", maxHeight: 200, marginBottom: 8 }}
              />
            ) : (
              <a
                key={index}
                href={URL.createObjectURL(file)}
                download={file.name}
                style={{ display: "block", color: 'inherit', marginBottom: 8 }}
              >
                {file.name}
              </a>
            )
          ))}
        </Box>
      )}
      {message.status === 'sending' && (
        <CircularProgress
          size={16}
          sx={{ position: 'absolute', right: 8, bottom: 8 }}
        />
      )}
      {/* Дата сообщения */}
      <Box sx={{justifyContent: 'end', display: 'flex'}}>
      <Typography
        variant="caption"
        sx={{
          mt: 0.5,
          color: 'text.secondary'
        }}
      >
        {new Date(message.timestamp).toLocaleString([], {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </Typography>
      </Box>
    </Box>


  </Box>
);

export const ChatPerson: React.FC<ChatPersonProps> = ({ id }) => {
  const { messages: wsMessages, sendMessage, isConnected } = useChatWebSocket(id);
  const { messages: restMessages, fetchMessages, loading, error } = useChatMessages();
  const [newMessage, setNewMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
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
  }, [mergedMessages.length, files]);

  const handleSend = () => {
    if ((newMessage.trim() || files.length > 0) && isConnected) {
      sendMessage({
        message_type: files.length > 0 ? "file" : "text",
        content: newMessage,
        files: files.length > 0 ? files : undefined,
        timestamp: new Date().toISOString()
      });
      setNewMessage("");
      setFiles([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
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
          bgcolor: 'grey.100',
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
        {/* Предпросмотр файлов */}
        {files.length > 0 && (
          <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mb: 2,
            p: 1,
            border: "1px solid #ddd",
            borderRadius: 1,
            backgroundColor: 'grey.100'
          }}>
            {files.map((file, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1,
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  backgroundColor: 'background.paper'
                }}
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                ) : (
                  <Box sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {file.name}
                  </Box>
                )}
                <IconButton
                  onClick={() => handleRemoveFile(index)}
                  size="small"
                  sx={{ ml: 'auto' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 0 }}>
          <Box sx={{ flex: 1 }}>
            <InputForm
              fullWidth
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Написать сообщение..."
              disabled={!isConnected}
            />
          </Box>
          <IconButton
            component="label"
            disabled={!isConnected}
            sx={{
              alignSelf: 'center',
              color: isConnected ? 'inherit' : 'action.disabled'
            }}
          >
            <AttachFileIcon />
            <input
              type="file"
              hidden
              multiple
              onChange={handleFileChange}
              disabled={!isConnected}
            />
          </IconButton>
          <CustomButton
            variant="contained"
            onClick={handleSend}
            disabled={!isConnected || (!newMessage.trim() && files.length === 0)}
          >
            Отправить
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};