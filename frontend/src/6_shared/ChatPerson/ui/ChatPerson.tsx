import { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Divider, IconButton, Paper, Theme, Typography, useMediaQuery, useTheme, } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { mockMessages } from "./chatMocks.ts";
import { globalsStyle } from "@6_shared/styles/globalsStyle.ts";
import { InputForm } from "../../Input/index.ts";
import { CustomButton } from "../../../6_shared/Button";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";

interface ChatWindowProps {
  onBack?: () => void;
  id: string;
}

interface Message {
  text?: string;
  time: string;
  isMe: boolean;
  author: string;
  isRead: boolean;
  files?: File[];
}

export const ChatPerson: FC<ChatWindowProps> = ({ onBack }) => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const chat = mockMessages.find((chat) => chat.id === id);
  const theme = useTheme();

  useEffect(() => {
    if (chat) {
      setMessages(chat.messages);
    } else {
      setMessages([]);
    }
  }, [id]);

  const handleSendMessage = () => {
    if (message.trim() === "" && files.length === 0) return;

    const newMessage: Message = {
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
      author: "Вы",
      isRead: false,
      files: files.length > 0 ? files : undefined, // Добавляем файлы
    };

    setMessages([...messages, newMessage]);
    setMessage("");
    setFiles([]); // Очищаем массив файлов после отправки
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files); // Преобразуем FileList в массив
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)); // Удаляем файл
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "auto",
        maxHeight: "80dvh",
      }}
    >
      {/* Шапка */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          bottom: 0,
        }}
      >
        {isMobile && (
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h6">
          {chat?.name || "Неизвестный чат"}
        </Typography>
      </Box>

      {/* Сообщения */}
      <Divider />
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: message.isMe ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            <Paper
              sx={{
                p: 2,
                maxWidth: "80%",
                bgcolor: message.isMe
                  ? globalsStyle.colors.blueLight
                  : theme.palette.grey[200],
                color: message.isMe ? "#fff" : "inherit",
                borderRadius: (theme: Theme) => theme.shape.borderRadius,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "left",
                  fontWeight: "600",
                }}
              >
                {message.isMe ? "Вы" : message?.author || chat?.name}
              </Typography>
              {message.text && <Typography variant="body1">{message.text}</Typography>}
              {message.files && (
                <Box>
                  {message.files.map((file, fileIndex) =>
                    file.type.startsWith("image/") ? (
                      <img
                        key={fileIndex}
                        src={URL.createObjectURL(file)}
                        alt="Uploaded"
                        style={{ maxWidth: "100%", height: "auto", marginBottom: 8 }}
                      />
                    ) : (
                      <a
                        key={fileIndex}
                        href={URL.createObjectURL(file)}
                        download={file.name}
                        style={{ display: "block", marginBottom: 8 }}
                      >
                        {file.name}
                      </a>
                    )
                  )}
                </Box>
              )}
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "right",
                }}
              >
                {message.time}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>
      <Divider />

      {/* Поле для сообщения и предпросмотр файлов */}
      <Box sx={{ p: 2 }}>
        {/* Предпросмотр файлов */}
        {files.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0,
              mb: 2,
              p: 1,
              border: `1px solid ${theme.palette.grey[400]}`,
              borderRadius: 1,
              backgroundColor: theme.palette.grey[100],
            }}
          >
            {files.map((file, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1,
                  border: `1px solid ${theme.palette.grey[400]}`,
                  borderRadius: 1,
                  backgroundColor: theme.palette.grey[200],
                }}
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                ) : (
                  <Typography variant="body2">{file.name}</Typography>
                )}
                <IconButton onClick={() => handleRemoveFile(index)} size="small" disableRipple>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {/* Поле ввода и кнопки */}
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flexGrow: 1 }}>
            <InputForm
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
              placeholder="Напишите сообщение..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
          </Box>
          <IconButton component="label" disableRipple>
            <AttachFileIcon />
            <input
              type="file"
              hidden
              multiple
              onChange={handleFileChange}
            />
          </IconButton>
          <CustomButton
            type="submit"
            variant="contained"
            onClick={handleSendMessage}
          >
            Отправить
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};