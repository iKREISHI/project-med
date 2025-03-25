import { FC } from "react";
import { Autocomplete, TextField, InputLabel, Theme } from "@mui/material";

interface ClientAutocompleteProps {
  value: string;
  fullWidth?: boolean;
  disabled?: boolean;
  placeholder: string;
  label?: string; 
  onChange: (value: string) => void;
  options: Array<{ id: number; name: string }>;
}

export const CustomAutocomplete: FC<ClientAutocompleteProps> = ({
  value,
  onChange,
  options,
  placeholder,
  label, 
  fullWidth = false,
  disabled = false,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <InputLabel>{label}</InputLabel>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.name}
        value={options.find((c) => c.name === value) || null}
        noOptionsText="Нет доступных вариантов"
        onChange={(_, newValue) => onChange(newValue ? newValue.name : "")}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            required
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
