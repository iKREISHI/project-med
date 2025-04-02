// @ts-nocheck
import { FC } from "react";
import { Autocomplete, TextField, InputLabel, Theme } from "@mui/material";

interface CustomAutocompleteProps<T> {
  value: T | null;
  fullWidth?: boolean;
  disabled?: boolean;
  placeholder: string;
  label?: string;
  onChange: (value: T | null) => void;
  options: T[];
  required?: boolean;
  getOptionLabel?: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  loading?: boolean;
}

export const CustomAutocomplete = <T extends unknown>({
  value,
  onChange,
  options,
  placeholder,
  label,
  fullWidth = false,
  disabled = false,
  required = false,
  getOptionLabel,
  isOptionEqualToValue = (option, value) => option === value,
  loading = false,
}: CustomAutocompleteProps<T>) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {label && (
        <InputLabel sx={{ pb: 0.5 }}>
          {label}
          {required && <span style={{ color: "red" }}>*</span>}
        </InputLabel>
      )}
      <Autocomplete
        options={options}
        getOptionLabel={getOptionLabel}
        value={value}
        noOptionsText="Нет доступных вариантов"
        onChange={(_, newValue) => onChange(newValue)}
        loading={loading}
        isOptionEqualToValue={isOptionEqualToValue}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            required={required}
            sx={{
              "& .MuiOutlinedInput-root": {
                padding: "0.67em",
                height: "40px",
                display: "flex",
                alignItems: "center",
                borderRadius: (theme: Theme) => theme.shape.borderRadius,
              },
              "& .MuiAutocomplete-input": {
                padding: 0,
                pl: 1
              },
              "& .css-1dune0f-MuiInputBase-input-MuiOutlinedInput-input": {
                zIndex: 1,
              },
              "& .css-8a1qk4-MuiInputBase-input-MuiOutlinedInput-input": {
                zIndex: 1,
              },
              "& .MuiOutlinedInput-root .MuiAutocomplete-input": {
                padding: 0,
                pl: 1
              },
              "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: (theme: Theme) => theme.palette.grey[500],
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: (theme: Theme) => theme.palette.grey[500],
                borderWidth: "1px",
              },
            }}
          />
        )}
        fullWidth={fullWidth}
        disabled={disabled}
        sx={{
          minWidth: "230px",
        }}
      />
    </div>
  );
};