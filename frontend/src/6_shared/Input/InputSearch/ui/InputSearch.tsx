import React from 'react';
import { Box, InputAdornment, IconButton, InputBase, useTheme, SxProps, Theme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { inputSearchSx } from './inputSearchSx.ts';

interface InputProps {
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  placeholder?: string;
  onSearch?: () => void;
  shadowColor?: string;
  isDarkText?: boolean;
  bgcolorFlag?: boolean;
  borderColor?: string;
  colorPlaceholder?: string;
  sx?: SxProps<Theme>;
}

const InputSearch: React.FC<InputProps> = ({
  type,
  value,
  onChange,
  fullWidth,
  placeholder,
  onSearch,
  isDarkText = false,
  bgcolorFlag = false,
  colorPlaceholder,
  sx = {},
}) => {
  const theme = useTheme();


  // Определяем цвет плейсхолдера
  const placeholderColor = colorPlaceholder
    ? colorPlaceholder 
    : isDarkText
    ? theme.palette.grey[400] 
    : theme.palette.grey[500];

  return (
    <Box sx={inputSearchSx.container}>
      <InputBase
        type={type}
        value={value}
        onChange={onChange}
        fullWidth={fullWidth}
        placeholder={placeholder}
        sx={{
          ...inputSearchSx.input(isDarkText, bgcolorFlag),
          ...sx,
        } as SxProps<Theme>}
        title={value}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={onSearch}
              sx={inputSearchSx.iconSearch(isDarkText)}
              aria-label="Найти"
              disableRipple
            >
              <SearchIcon sx={{fontSize: '26px'}} />
            </IconButton>
          </InputAdornment>
        }
        inputProps={{
          sx: {
            '&::placeholder': {
              color: placeholderColor,
              opacity: 1,
              fontSize: '1rem'
            },
          },
        }}
      />
    </Box>
  );
};

export default InputSearch;