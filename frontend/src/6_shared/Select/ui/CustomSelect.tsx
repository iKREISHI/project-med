import { FC } from "react";
import { FormControl, MenuItem, Select, SelectChangeEvent, Theme, InputLabel } from "@mui/material";

interface SelectProps {
  value: string;
  disabled?: boolean;
  fullWidth?: boolean;
  required?: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  options: Array<{ id: number; name: string; disabled?: boolean }>;
  label?: string;

}

export const CustomSelect: FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  fullWidth = false,
  label,
  required = false
}) => {
  return (
    <FormControl fullWidth={fullWidth}>
      {label && (
        <InputLabel

          shrink
          sx={{
            position: 'relative',
            transform: 'none',
            mb: 0.5,
            color: (theme: Theme) => theme.palette.text.secondary,
            '&.Mui-focused': {
              color: (theme: Theme) => theme.palette.text.secondary
            }
          }}
        >
          {label}
          {required && <span style={{ color: "red" }}>*</span>}
        </InputLabel>
      )}
      <Select
        required={required}
        displayEmpty
        value={value}
        onChange={(e: SelectChangeEvent) => onChange(e.target.value as string)}
        disabled={disabled}
        renderValue={(selected) => {
          if (!selected) {
            return <span style={{ color: '#757575' }}>{placeholder}</span>;
          }
          return selected;
        }}
        inputProps={{
          "aria-label": placeholder,
        }}
        sx={{
          height: "40px",
          borderRadius: (theme: Theme) => theme.shape.borderRadius,
          "& .MuiSelect-select": {
            padding: 0,
            zIndex: 1,
            backgroundColor: "transparent",
            boxShadow: "none",
            height: "0px !important",
            display: "flex",
            alignItems: "center",
            ml: 2,
            mr: 1,
            "&:focus": {
              backgroundColor: "transparent",
            },
            "&.Mui-disabled": {
              cursor: "not-allowed",
            },
          },
          "&.Mui-disabled": {
            cursor: "not-allowed !important",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: (theme: Theme) => theme.palette.grey[500],
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1,
            borderColor: (theme: Theme) => theme.palette.grey[500],
          },
        }}
      >
        <MenuItem disabled value="">
          {placeholder}
        </MenuItem>
        {options.map((doc) => (
          <MenuItem
            key={doc.id}
            value={doc.name}
            disabled={doc.disabled}
            disableRipple
            aria-label={doc.name}
          >
            {doc.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};