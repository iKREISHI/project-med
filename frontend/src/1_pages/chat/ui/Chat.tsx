import React from 'react';
import { Box, useTheme } from "@mui/material";
import { ChatMenu } from "@6_shared/ChatMenu";
import { useParams } from "react-router-dom";
import { ChatPerson } from "@6_shared/ChatPerson";
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx";
import Grid from '@mui/material/Grid';

export const Chat: React.FC = () => {
  const { id } = useParams();
  const theme = useTheme();

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
          <ChatMenu />
        </Grid>

        <Grid item xs={12} md={9} sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper'
        }}>
          {id ? (
            <ChatPerson id={id} />
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