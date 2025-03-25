import React from 'react';
import { useMediaQuery, Theme, Box, useTheme } from "@mui/material";
import { ChatMenu } from "@6_shared/ChatMenu";
import { useNavigate, useParams } from "react-router-dom";
import { ChatPerson } from "@6_shared/ChatPerson";
import { mockMessages } from "@6_shared/ChatPerson/ui/chatMocks";
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx";
import Grid from '@mui/material/Grid2';

// станица чата 
export const Chat: React.FC = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const handleBack = () => navigate("/chat");

  return (
    <Box sx={{ ...globalsStyleSx.container, overflow: 'hidden' }}>
      <Grid container sx={{         
        flex: 1, 
        overflow: "hidden", 
        minHeight: "80dvh", 
        maxHeight: "80dvh", 
         }}>
        {(!isMobile || !id) && (
          <Grid size={{ xs: 12, md: 3 }}
            sx={{
              bgcolor: {
                md: theme.palette.grey[100],
                xs: theme.palette.background.paper
              },
              boxShadow: '0px 0 3px rgba(0,0,0,0.1)',
              zIndex: 1,
              pt: {md: 1, xs: 0.5},
              overflow: "auto"
            }}>
            <ChatMenu menuItems={mockMessages} />
          </Grid>
        )}

        {(isMobile && id) ? (
          <Grid size={{ xs: 12 }} sx={{ zIndex: 1,
            overflow: "auto"}}>
            <ChatPerson id={id} onBack={handleBack} /></Grid>
        ) : (
          !isMobile && (
            <Grid size={{ md: 9}}>
              {id ? (
                <ChatPerson id={id} />
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
          )
        )}
      </Grid>
    </Box>
  );
};