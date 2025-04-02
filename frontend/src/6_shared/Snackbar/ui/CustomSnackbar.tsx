// @ts-nocheck
import { FC } from "react";
import { IconButton, Snackbar, Theme } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface SuccessSnackbarProps {
    open: boolean;
    onClose: () => void;
    message: string;
}

// Отображение уведобления с сообщением
export const CustomSnackbar: FC<SuccessSnackbarProps> = ({ open, onClose, message }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            message={message}
            sx={{
                "& .MuiSnackbarContent-root": {
                    backgroundColor: (theme: Theme) => theme.palette.grey[300],
                    color: "black" 
                }
            }}
            action={
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={onClose}
                disableRipple
            >
                <CloseIcon fontSize="small" />
            </IconButton>}
        />
    );
};