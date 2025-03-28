import React from 'react';
import Button from '@mui/material/Button';
import { Theme, Typography } from '@mui/material';


interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  variant?: 'text' | 'contained' | 'outlined';
  startIcon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset'
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, onClick, fullWidth = false, variant = 'contained', startIcon, type}) => {
  return (
    <Button
      variant={variant}
      // disableElevation
      onClick={onClick}
      fullWidth={fullWidth}
      startIcon={startIcon}
      disableRipple
      type={type}
      sx={{borderRadius: (theme: Theme) => theme.shape.borderRadius,}}
    >
      <Typography style={{ textTransform: 'none' }}>
        {children}
      </Typography>
    </Button>
  );
};

export default CustomButton;