import React from 'react';
import { TextField, Box, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { inputSearchSx } from './inputSearchSx';

interface InputProps {
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  placeholder?: string;
  onSearch?: () => void;
}

const InputSearch: React.FC<InputProps> = ({ type, value, onChange, fullWidth, placeholder, onSearch }) => {

  return (
    <Box sx={inputSearchSx.container}>
      <TextField
        type={type}
        value={value}
        onChange={onChange}
        fullWidth={fullWidth}
        variant="outlined"
        placeholder={placeholder}
        sx={inputSearchSx.input}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={onSearch}
                sx={inputSearchSx.iconSearch}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default InputSearch;