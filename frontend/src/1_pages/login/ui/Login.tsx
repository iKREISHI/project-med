// @ts-nocheck
import React from 'react';
import { Box, Container, GlobalStyles } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {LoginForm} from '@4_features/auth';
import { loginSx } from './loginSx';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLoginSubmit = (username: string, password: string) => {
    console.log(username, password);
    navigate('/'); 
  };

  return (
    <>
      <GlobalStyles
        styles={{
          body: { margin: 0, padding: 0 },
        }}
      />
      <Box
        component="main"
        sx={{
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Container maxWidth="sm" sx={{ padding: 0 }}>
          <Box sx={loginSx.container}>
            <LoginForm onSubmit={handleLoginSubmit} />
          </Box>
        </Container>
      </Box>
    </>
  );
};