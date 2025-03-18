import { FC } from "react";
import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { globalsStyle } from "../../styles/globalsStyle";

interface SelectProps {
  value: string;
  disabled?: boolean;
  fullWidth?: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  options: Array<{ id: number; name: string; disabled?: boolean }>;
}

export const CustomSelect: FC<SelectProps> = ({ value, onChange, options, placeholder, disabled = false, fullWidth=false }) => {
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
          }
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