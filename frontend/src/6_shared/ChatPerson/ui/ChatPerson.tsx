import React, { useState, useEffect, useMemo, useRef } from "react";
import { Box, CircularProgress, IconButton, Theme, Typography, useMediaQuery } from "@mui/material";
import { useChatWebSocket } from "@5_entities/chat/";
import { useChatMessages } from "@5_entities/chat/";
import { CustomButton } from "@6_shared/Button";
import { InputForm } from "@6_shared/Input";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import { globalsStyle } from "@6_shared/styles/globalsStyle";
import { getCurrentUser } from "@5_entities/user";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";


interface ChatPersonProps {
  id: string;
  currentUsername?: string;
}

// const MessageItem = ({ message, currentUsername }: any) => {
//   const renderFile = (fileData: string, fileExtension: string, index: number) => {
//     const fileType = fileExtension || fileData.split(';')[0].split(':')[1];
//     const isImage = fileType.startsWith("image/") || ['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension);

//     return isImage ? (
//       <img
//         key={index}
//         src={fileData}
//         alt="Uploaded"
//         style={{ maxWidth: "100%", maxHeight: 200, marginBottom: 8 }}
//       />
//     ) : (
//       <a
//         key={index}
//         href={fileData}
//         download={`file.${fileExtension}`}
//         style={{ display: "block", color: 'inherit', marginBottom: 8 }}
//       >
//         Скачать файл{fileExtension}
//       </a>
//     );
//   };

//   return (
//     <Box sx={{
//       display: 'flex',
//       flexDirection: 'column',
//       mb: 2,
//       width: '100%'
//     }}>
//       <Box sx={{
//         p: 2,
//         borderRadius: 4,
//         maxWidth: '75%',
//         width: "fit-content",
//         bgcolor: message.sender == currentUsername
//           ? (message.status === 'sending' ? 'grey.300' : `${globalsStyle.colors.blueLight}`)
//           : 'background.paper',
//         color:  message.sender == currentUsername ? 'primary.contrastText' : 'text.primary',
//         boxShadow: 2,
//         position: 'relative',
//         transition: 'background-color 0.3s ease',
//         alignSelf:  message.sender == currentUsername ? "flex-end" : "flex-start",
//       }}>
//         {!message.fromCurrentUser && (
//           <Box>
//             <Typography
//               variant="caption"
//               sx={{
//                 fontWeight: 500,
//                 mb: 0.5,
//               }}
//             >
//               {message.sender || 'Unknown'}
//             </Typography>
//           </Box>
//         )}

//         {message.content}

//         {message.file_data && (
//           <Box sx={{ mt: 1 }}>
//             {Array.isArray(message.file_data) ? (
//               message.file_data.map((file: any, index: number) => (
//                 renderFile(file.file_data, file.file_extension, index)
//               ))
//             ) : (
//               renderFile(message.file_data, message.file_extension, 0)
//             )}
//           </Box>
//         )}

//         {message.status === 'sending' && (
//           <CircularProgress
//             size={16}
//             sx={{ position: 'absolute', right: 8, bottom: 8 }}
//           />
//         )}

//         <Box sx={{ justifyContent: 'end', display: 'flex' }}>
//           <Typography
//             variant="caption"
//             sx={{
//               mt: 0.5,
//             }}
//           >
//             {new Date(message.timestamp).toLocaleString([], {
//               year: 'numeric',
//               month: 'numeric',
//               day: 'numeric',
//               hour: '2-digit',
//               minute: '2-digit'
//             })}
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };
const MessageItem = ({ message, currentUsername }: any) => {
  const renderFile = (fileData: string, fileExtension: string, index: number) => {
    const fileType = fileExtension || fileData.split(';')[0].split(':')[1];
    const isImage = fileType.startsWith("image/") || ['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension);

    return isImage ? (
      <img
        key={index}
        src={fileData}
        alt="Uploaded"
        style={{ maxWidth: "100%", maxHeight: 200, marginBottom: 8 }}
      />
    ) : (
      <a
        key={index}
        href={fileData}
        download={`file.${fileExtension}`}
        style={{ display: "block", color: 'inherit', marginBottom: 8 }}
      >
        Скачать файл.{fileExtension}
      </a>
    );
  };

  // Не отображаем сообщения со статусом 'sending'
  if (message.status === 'sending') {
    return null;
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      mb: 2,
      width: '100%'
    }}>
      <Box sx={{
        p: 2,
        borderRadius: 4,
        maxWidth: '75%',
        width: "fit-content",
        bgcolor: message.sender == currentUsername
          ? `${globalsStyle.colors.blueLight}`
          : 'background.paper',
        color:  message.sender == currentUsername ? 'primary.contrastText' : 'text.primary',
        boxShadow: 2,
        position: 'relative',
        alignSelf:  message.sender == currentUsername ? "flex-end" : "flex-start",
      }}>
        {!message.fromCurrentUser && (
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 500,
                mb: 0.5,
              }}
            >
              {message.sender || 'Unknown'}
            </Typography>
          </Box>
        )}

        {message.content}

        {message.file_data && (
          <Box sx={{ mt: 1 }}>
            {Array.isArray(message.file_data) ? (
              message.file_data.map((file: any, index: number) => (
                renderFile(file.file_data, file.file_extension, index)
              ))
            ) : (
              renderFile(message.file_data, message.file_extension, 0)
            )}
          </Box>
        )}

        <Box sx={{ justifyContent: 'end', display: 'flex' }}>
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
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
};
export const ChatPerson: React.FC<ChatPersonProps> = ({ id }) => {
  const { messages: wsMessages, sendMessage, isConnected } = useChatWebSocket(id);
  const { messages: restMessages, fetchMessages, loading, error } = useChatMessages();
  const [newMessage, setNewMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [hasFetchedHistory, setHasFetchedHistory] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const onBack = () => navigate(-1);
  const [currentUsername, setCurrentUsername] = useState<string>("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUsername(user.username || "");
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchCurrentUser();
  }, []);

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

  const handleSend = async () => {
    if (!isConnected) {
      console.log("Не отправлено: WebSocket не подключен");
      return;
    }
  
    try {
      // Если есть файлы - обрабатываем их
      if (files.length > 0) {
        console.log("Начало обработки файлов. Количество файлов:", files.length);
        
        for (const file of files) {
          console.log("Обработка файла:", file.name, "тип:", file.type, "размер:", file.size);
          
          const fileData = await readFileAsBase64(file);
          console.log("Файл конвертирован в base64. Длина данных:", fileData.length);
  
          const message = {
            message_type: "file",
            file_data: fileData,
            file_extension: getFileExtension(file.name),
            content: newMessage || `${file.name}`,
            timestamp: new Date().toISOString()
          };
  
          console.log("Подготовлено сообщение с файлом:", {
            ...message,
            file_data: `${message.file_data.substring(0, 50)}...` // Выводим только начало base64
          });
          
          sendMessage(message);
          console.log("Сообщение с файлом отправлено");
        }
      }
      // Если есть текст - отправляем текстовое сообщение
      else if (newMessage.trim()) {
        const textMessage = {
          message_type: "text",
          content: newMessage,
          timestamp: new Date().toISOString()
        };
        
        console.log("Отправка текстового сообщения:", textMessage);
        sendMessage(textMessage);
        console.log("Текстовое сообщение отправлено");
      } else {
        console.log("Нечего отправлять: нет текста и файлов");
      }
  
      setNewMessage("");
      setFiles([]);
      console.log("Состояние очищено");
    } catch (error) {
      console.error("Ошибка при отправке:", {
        error: error,
        message: error.message,
        stack: error.stack
      });
    }
  };

  // Вспомогательные функции
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
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
        zIndex: 1,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton onClick={onBack} disableRipple>
              <ArrowBackIcon />
            </IconButton>
          )}
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
          overflowX: "hidden",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          bgcolor: 'grey.100',
          '&::-webkit-scrollbar': {
            width: '0.4em'
          },
          '&::-webkit-scrollbar-track': {
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
          }
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
          <MessageItem key={`${msg.id}_${msg.timestamp}`} message={msg} currentUsername={currentUsername}/>
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
                  disableRipple
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
            disableRipple
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