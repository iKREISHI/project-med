import { FC } from "react";
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { Theme } from '@mui/material/styles';


interface SelectProps {
  value: string;
  disabled?: boolean;
  fullWidth?: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  options: Array<{ id: number; name: string; disabled?: boolean }>;
}

// Селектор
export const CustomSelect: FC<SelectProps> = ({ value, onChange, options, placeholder, disabled = false, fullWidth = false }) => {
  return (
    <FormControl fullWidth={fullWidth}>
      <Select
        displayEmpty
        value={value}
        onChange={(e: SelectChangeEvent) => onChange(e.target.value as string)}
        required
        disabled={disabled}
        renderValue={(selected) => {
          if (!selected) {
            return placeholder;
          }
          return selected;
        }}
        sx={{
          "& .MuiSelect-select": {
            padding: 1,
            zIndex: 1,
            backgroundColor: "transparent", 
            border: (theme: Theme) => `1px solid ${theme.palette.grey[400]}`,
            boxShadow: "none",
            "&:focus": {
              backgroundColor: "transparent",
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none", 
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
      >
        <MenuItem disabled value="">
          {placeholder}
        </MenuItem>
        {options.map((doc) => (
          <MenuItem key={doc.id} value={doc.name} disabled={doc.disabled} disableRipple>
            {doc.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};