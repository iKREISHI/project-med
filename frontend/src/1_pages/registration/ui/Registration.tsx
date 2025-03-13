import React, { useState } from 'react';
import { InputForm, CustomButton } from '../../../5_Shared';
import { Typography, Box, Paper, GlobalStyles } from '@mui/material';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid2';
import { registrationSx } from './registrationSx';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';


export const Registration: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log(email, firstName, lastName,password, confirmPassword);
    navigate('/login');
    
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
          <Box sx={registrationSx.container}>
            <Paper elevation={0} sx={registrationSx.paper}>
              <Box sx={{ marginBottom: '2em' }}>
                <Typography variant="h4" component="h2" sx={{ padding: '.3em 0' }}>
                  Регистрация
                </Typography>
                <Typography variant='body2'>
                  Введите свою информацию ниже, чтобы продолжить
                </Typography>
              </Box>
              <Alert severity="success" icon={false}>This is a success Alert.</Alert>
              <Box sx={{ marginTop: 1 }}>
                <InputForm
                  type="email"
                  label="Почта"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
              </Box>
              <Box sx={{ marginTop: 1 }}>
                <InputForm
                  type="text"
                  label="Имя"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  fullWidth
                />
              </Box>
              <Box sx={{ marginTop: 1 }}>
                <InputForm
                  type="text"
                  label="Фамилия"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  fullWidth
                />
              </Box>

              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <InputForm
                    type="password"
                    label="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <InputForm
                    type="password"
                    label="Повторить пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box sx={{ padding: '1em 0' }}>
                <CustomButton onClick={handleLogin} fullWidth>
                  Создать Аккаунт
                </CustomButton>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </>
  );
};