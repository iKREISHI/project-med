import React from 'react';
import { Box, Theme, useMediaQuery, useTheme } from "@mui/material";
import { ChatMenu } from "@6_shared/ChatMenu";
import { useParams, useNavigate } from "react-router-dom";
import { ChatPerson } from "@6_shared/ChatPerson";
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx";
import Grid from '@mui/material/Grid';

export const Chat: React.FC = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleChatSelect = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  // Стили для мобильной версии
  const mobileContainerSx = {
    ...globalsStyleSx.container,
    overflow: 'hidden',
    height: '70dvh', // Уменьшенная высота для мобильных устройств
    mt: 2,          // Небольшой отступ сверху
    mb: 2,          // Небольшой отступ снизу
    borderRadius: 2, // Закругленные углы
    boxShadow: 1    // Легкая тень для лучшего визуального отделения
  };

  // Если это мобильное устройство и не выбран чат, показываем только меню
  if (isMobile && !id) {
    return (
      <Box sx={mobileContainerSx}>
        <ChatMenu onChatSelect={handleChatSelect} />
      </Box>
    );
  }

  // Если это мобильное устройство и выбран чат, показываем только чат
  if (isMobile && id) {
    return (
      <Box sx={mobileContainerSx}>
        <ChatPerson key={id} id={id} />
      </Box>
    );
  }

  // Десктопная версия (без изменений)
  return (
    <Box sx={{ ...globalsStyleSx.container, overflow: 'hidden' }}>
      <Grid container sx={{
        flex: 1,
        height: '80dvh',
        overflow: 'hidden'
      }}>
        <Grid item xs={12} md={3} sx={{
          bgcolor: theme.palette.grey[100],
          borderRight: `1px solid ${theme.palette.divider}`,
          overflowY: 'auto'
        }}>
          <ChatMenu onChatSelect={handleChatSelect} />
        </Grid>

        <Grid item xs={12} md={9} sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper'
        }}>
          {id ? (
            <ChatPerson key={id} id={id} />
          ) : (
            <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary'
            }}>
              Выберите чат из списка слева
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};