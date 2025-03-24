import React, { useState } from 'react';
// import { InputForm, CustomButton } from '../../../6_shared';
import { Typography, Box, Paper } from '@mui/material';
import { loginFormSx } from './loginFormSx.ts';
import { InputForm } from '../../../6_shared/Input';
import { CustomButton } from '../../../6_shared/Button';

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
}

export const  LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit(username, password);
  };

  return (
    <Paper elevation={0} sx={loginFormSx.paper}>
      <Box sx={{ marginBottom: '1em' }}>
        <Typography variant="h4" component="h2" sx={{ padding: '.2em 0' }}>
          Вход
        </Typography>
        <Typography variant="body2">
          Войдите в свою учетную запись.
        </Typography>
      </Box>
      <Box>
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
        <CustomButton onClick={handleSubmit} fullWidth>
          Войти
        </CustomButton>
      </Box>
    </Paper>
  );
};

