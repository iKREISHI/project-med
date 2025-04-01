import { FC, useState } from "react";
import { Box, Divider, IconButton, Typography, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { PatientMenu } from "../../PatientMenu";
import { PatientRegisterForm } from "@4_features/patient/RegisterForm/ui/PatientRegisterForm.tsx";
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CustomSnackbar } from "@6_shared/Snackbar";

export const Patient: FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)"); 
  const menuItems = [
    { name: "Контактная информация", path: "info" },
    { name: "Паспортные данные", path: "passport" },
    { name: "Медицинские данные", path: "medical-data" },
    { name: "Адреса", path: "addresses" },
    { name: "Дополнительная информация", path: "additional-info" },
  ];
  const navigate = useNavigate();
  
  // Состояния для снэкбара
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // Функция для показа успешного сообщения
  const showSuccessMessage = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  // Функция для показа сообщения об ошибке
  const showErrorMessage = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  };

  // Функция закрытия снэкбара
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <Box sx={{ ...globalsStyleSx.container, overflow: 'hidden' }}>

      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }} disableRipple>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h2">Регистрация пациента</Typography>
        </Box>
        <PatientRegisterForm 
          onSuccess={() => showSuccessMessage("Пациент успешно зарегистрирован!")}
          onError={(error) => showErrorMessage(error.message || "Ошибка при регистрации пациента")}
        />
      </Box>
      <Divider />
      <Box sx={{
        position: 'relative', 
      }}>
        {isMobile && (
          <Box sx={{
            width: '100%',
            zIndex: 1,
          }}>
            <PatientMenu menuItems={menuItems}/>
          </Box>
        )}
        <Box sx={globalsStyleSx.flexContainerMenu}>
          {!isMobile && <PatientMenu menuItems={menuItems} />}
          <Box sx={{ flex: 1, mt: isMobile ? 6 : 0, overflow: 'auto' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      
      {/* Снэкбар для уведомлений */}
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={6000}
      />
    </Box>
  ); 
};