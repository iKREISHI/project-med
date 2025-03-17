import { FC } from "react";
import { Box, Divider, Typography, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { PatientMenu } from "../../../../6_shared/PatientMenu";
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
