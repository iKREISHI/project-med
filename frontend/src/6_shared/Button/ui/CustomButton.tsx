// @ts-nocheck
import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import { grey } from '@mui/material/colors'; // Добавляем серый цвет из палитры MUI

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  variant?: 'text' | 'contained' | 'outlined';
  startIcon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  fullWidth = false,
  variant = 'contained',
  startIcon,
  type = 'button',
  color = 'primary',
  disabled = false,
}) => {
  return (
    <Button
      color={color}
      variant={variant}
      onClick={onClick}
      fullWidth={fullWidth}
      startIcon={startIcon}
      disableRipple
      type={type}
      disabled={disabled}
      sx={{
        borderRadius: (theme: Theme) => theme.shape.borderRadius,
        ...(disabled && {
          backgroundColor: grey[300], 
          color: grey[600],          
          '&:hover': {
            backgroundColor: grey[300], 
          },
        }),
      }}
    >
      <Typography sx={{ textTransform: 'none' }} >
        {children}
      </Typography>
    </Button>
  );
};

export default CustomButton;