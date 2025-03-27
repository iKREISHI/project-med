import React from "react";
import { Box, Typography, InputBase } from "@mui/material";
import { inputFormSx } from "./inputFormSx.ts";

interface InputProps {
  type: string;
  value: string;
  rows?: number;
  label?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>; 
}

const InputForm: React.FC<InputProps> = ({ type, value, onChange, onKeyPress, fullWidth, placeholder = "", label = "", required = false, disabled = false, inputProps = {}, multiline=false, rows }) => {
  return (
    <Box sx={{ textAlign: "start" }}>
      <Typography variant="body2">
        {label}
      </Typography>
      <InputBase
        type={type}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        fullWidth={fullWidth}
        placeholder={placeholder}
        sx={inputFormSx.input}
        required={required}
        disabled={disabled}
        inputProps={inputProps}
        multiline={multiline}
        rows={rows}
      />
    </Box>
  );
};

export default InputForm;