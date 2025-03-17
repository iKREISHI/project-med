import { FC } from "react";
import { IconButton, Snackbar } from "@mui/material";
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
            action={
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={onClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>}
        />
    );
};