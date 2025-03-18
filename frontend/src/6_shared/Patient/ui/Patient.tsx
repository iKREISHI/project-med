<<<<<<< HEAD:frontend/src/1_pages/registry/Patient/ui/Patient.tsx
import { FC } from "react";
import { Box, Divider, Typography, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { PatientMenu } from "../../../../6_Shared/PatientMenu";
import { patientSx } from "./patientSx";
import { PatientRegisterForm } from "../../../../4_Features/patient/RegisterForm";

export const Patient: FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)"); 

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
            <PatientMenu />
          </Box>
        )}
        <Box sx={patientSx.container}>
          {!isMobile && <PatientMenu />}
          <Box sx={{ flex: 1, mt: isMobile ? 6 : 0, overflow: 'auto' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      </Box>
  );
};
=======
import { FC } from "react";
import { Box, Divider, Typography, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { PatientMenu } from "../../PatientMenu";
import { patientSx } from "./patientSx";
import { PatientRegisterForm } from "../../../4_Features/patient/RegisterForm";

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
>>>>>>> 57f26553 (add patient admission and recording):frontend/src/6_shared/Patient/ui/Patient.tsx
