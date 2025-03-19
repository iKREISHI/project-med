import React from 'react';
import { Box, InputAdornment, IconButton, InputBase, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { inputSearchSx } from './inputSearchSx.ts';
import { globalsStyle } from '../../../styles/globalsStyle.ts';

interface InputProps {
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  placeholder?: string;
  onSearch?: () => void;
  shadowColor?: string;
  isDarkText?: boolean;
}

const InputSearch: React.FC<InputProps> = ({ type, value, onChange, fullWidth, placeholder, onSearch, shadowColor = 'rgba(255, 255, 255, 0.2)', isDarkText = false, }) => {
  const theme = useTheme();
  return (
    <Box sx={inputSearchSx.container}>
      <InputBase
        type={type}
        value={value}
        onChange={onChange}
        fullWidth={fullWidth}
        placeholder={placeholder}
        sx={inputSearchSx.input(shadowColor, isDarkText)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={onSearch}
              sx={inputSearchSx.iconSearch(isDarkText)}
              aria-label="Найти"
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        }
        inputProps={{
          sx: {
            '&::placeholder': {
              color: isDarkText ? theme.palette.grey[700] : globalsStyle.colors.grey400, 
              opacity: 1, 
            },
          },
        }}
      />
    </Box>
  );
};

export default InputSearch;