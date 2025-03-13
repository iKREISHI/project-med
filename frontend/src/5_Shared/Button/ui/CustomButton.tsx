import React from 'react';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  variant?: 'text' | 'contained' | 'outlined';
  startIcon?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, onClick, fullWidth = false, variant = 'contained', startIcon, }) => {
  return (
    <Button
      variant={variant}
      // disableElevation
      onClick={onClick}
      fullWidth={fullWidth}
      startIcon={startIcon}
    >
      <Typography style={{ textTransform: 'none' }}>
        {children}
      </Typography>
    </Button>
  );
};

export default CustomButton;