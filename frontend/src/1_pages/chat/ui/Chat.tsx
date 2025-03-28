import React from 'react';
import { useMediaQuery, Theme, Box, useTheme } from "@mui/material";
import { ChatMenu } from "@6_shared/ChatMenu";
import { useNavigate, useParams } from "react-router-dom";
import { ChatPerson } from "@6_shared/ChatPerson";
import { mockMessages } from "@6_shared/ChatPerson/ui/chatMocks";
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx";
import Grid from '@mui/material/Grid';
import { useUserChatRooms } from "@5_entities/chat/api/useUserChatRooms.ts";

export const Chat: React.FC = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { rooms, loading } = useUserChatRooms();
  const handleBack = () => navigate("/chat");

  return (
    <Box sx={{ ...globalsStyleSx.container, overflow: 'hidden' }}>
      <Grid container sx={{
        flex: 1,
        overflow: "hidden",
        minHeight: "80dvh",
        maxHeight: "80dvh",
      }}>
        {/* Меню чатов - теперь всегда видимо */}
        <Grid item xs={12} md={3}
              sx={{
                bgcolor: {
                  md: theme.palette.grey[100],
                  xs: theme.palette.background.paper
                },
                zIndex: 1,
                pt: { md: 1, xs: 0.5 },
                overflow: "auto"
              }}>
          <ChatMenu menuItems={mockMessages} />
        </Grid>

        {/* Область чата */}
        <Grid item xs={12} md={9} sx={{ height: "100%" }}>
          {id ? (
            <ChatPerson id={id} onBack={isMobile ? handleBack : undefined} />
          ) : (
            <Box sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.palette.grey[800]
            }}>
              Выберите чат для начала общения
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};