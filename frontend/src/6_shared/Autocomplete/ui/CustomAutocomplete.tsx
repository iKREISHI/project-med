import { FC } from "react";
import { Autocomplete, TextField } from "@mui/material";

interface ClientAutocompleteProps {
    value: string;
    fullWidth?: boolean;
    disabled?: boolean;
    placeholder: string;
    onChange: (value: string) => void;
    options: Array<{ id: number; name: string }>;
}

export const CustomAutocomplete: FC<ClientAutocompleteProps> = ({ value, onChange, options, placeholder, fullWidth=false, disabled=false}) => {
    return (
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
                        "& .css-1dune0f-MuiInputBase-input-MuiOutlinedInput-input": {
                            zIndex: 1, 
                        },
                    }}
                />
            )}
            fullWidth={fullWidth}
            disabled={disabled}
            sx={{
                minWidth: "230px",
                "& .MuiOutlinedInput-root": {
                    padding: 0.3,
                },
            }}
        />
    );
};