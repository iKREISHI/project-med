// @ts-nocheck
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface UserCredentialsModalProps {
  open: boolean;
  onClose: () => void;
  credentials: {
    login: string;
    password: string;
  };
}

export const UserCredentialsModal: React.FC<UserCredentialsModalProps> = ({
  open,
  onClose,
  credentials
}) => {
  const handlePrint = () => {
    const printContent = `
      <h2>Данные для входа</h2>
      <p><strong>Логин:</strong> ${credentials.login}</p>
      <p><strong>Пароль:</strong> ${credentials.password}</p>
      <p>Сохраните эти данные в надежном месте!</p>
    `;

    const printWindow = window.open('', '_blank');
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.focus();
    printWindow?.print();
  };

  const handleDownload = () => {
    const content = `Логин: ${credentials.login}\nПароль: ${credentials.password}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credentials_${credentials.login}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Данные для входа</Typography>
          <Box>
            <IconButton onClick={handlePrint} aria-label="print">
              <PrintIcon />
            </IconButton>
            <IconButton onClick={handleDownload} aria-label="download">
              <FileDownloadIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="body1" paragraph>
            <strong>Логин:</strong> {credentials.login}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Пароль:</strong> {credentials.password}
          </Typography>
          <Typography variant="body2" color="error">
            Сохраните эти данные в надежном месте!
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};