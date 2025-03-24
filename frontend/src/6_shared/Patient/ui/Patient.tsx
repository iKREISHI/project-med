import { FC } from "react";
import { Box, Divider, Typography, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { PatientMenu } from "../../PatientMenu";
import { patientSx } from "./patientSx";
import { PatientRegisterForm } from "@4_features/patient/RegisterForm/ui/PatientRegisterForm.tsx";

export const Patient: FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)"); 
  const menuItems = [
    { name: "Контактная информация", path: "info" },
    { name: "Паспортные данные", path: "passport" },
    { name: "Медицинские данные", path: "medical-data" },
    { name: "Адреса", path: "addresses" },
    // { name: "История посещения", path: "visit-history" },
    { name: "Дополнительная информация", path: "additional-info" },
  ];
  
  
  return (
    <Box sx={patientSx.containerMain}>

      <Box sx={{p: 4 }}>
        <Typography variant="h1" gutterBottom>Регистрация пациента</Typography>
        <PatientRegisterForm />
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
        <Box sx={patientSx.container}>
          {!isMobile && <PatientMenu menuItems={menuItems} />}
          <Box sx={{ flex: 1, mt: isMobile ? 6 : 0, overflow: 'auto' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      </Box>
  ); 
};
