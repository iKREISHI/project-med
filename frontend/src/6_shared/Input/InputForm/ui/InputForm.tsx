import React from 'react';
import { TextField, Box, Typography } from '@mui/material';
import { inputFormSx } from './inputFormSx.ts';

interface InputProps {
  type: string;
  value: string;
  label?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  placeholder?: string;
  required?: boolean;
}
const InputForm: React.FC<InputProps> = ({ type, value, onChange, fullWidth, placeholder = "", label = "", required = false, }) => {
  return (
    <Box sx={{ textAlign: 'start' }}>
      <Typography variant='body2' sx={{ padding: '.2em 0' }}>{label}</Typography>
      <TextField
        type={type}
        value={value}
        onChange={onChange}
        fullWidth={fullWidth}
        variant="outlined"
        placeholder={placeholder}
        sx={inputFormSx.input}
        required={required}
      />
    </Box>
  );
};

export default InputForm;