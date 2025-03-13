import React, { useState } from 'react';
import { InputForm, CustomButton } from '../../../5_Shared';
import { Typography, Box, Paper, useTheme, GlobalStyles } from '@mui/material';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { loginSx } from './loginSx';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log(username, password);
    navigate('/');
  };
  const theme = useTheme();
  return (
    <>
      <GlobalStyles
        styles={{
          body: { margin: 0, padding: 0 },
        }}
      />
      <Box component="main"
        sx={{
          backgroundColor: theme.palette.background.default,
        }}>
        <Container maxWidth="sm" sx={{ padding: 0 }}>
          <Box sx={loginSx.container}>
            <Paper elevation={0} sx={loginSx.paper}>
              <Box sx={{ marginBottom: '2em' }}>
                <Typography variant="h4" component="h2" sx={{ padding: '.7em 0' }}>
                  Вход
                </Typography>
                <Typography variant='body2'>
                  Войдите в свою учетную запись.
                </Typography>
              </Box>
              <Alert severity="error" icon={false}>This is a success Alert.</Alert>
              <Box sx={{ marginTop: 1 }}>
                <InputForm
                  type="email"
                  label="Почта"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                />
              </Box>

              <Box sx={{ marginTop: 1 }}>
                <InputForm
                  type="password"
                  label="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                />
              </Box>

              <Box sx={{ padding: '1em 0' }}>
                <CustomButton onClick={handleLogin} fullWidth>
                  Войти
                </CustomButton>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </>
  );
};