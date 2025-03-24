import { FC } from "react";
import { admissionSx } from "./admissionSx";
import { Box, Divider, Typography, useMediaQuery } from "@mui/material";
import { PatientMenu } from "@6_shared/PatientMenu";
import { Outlet, useLocation } from "react-router-dom";
import { AdmissionInfoForm } from "@4_features/admission/AdmissionInfoForm";

export const Admission: FC = () => {
  const location = useLocation();
  const { patientName } = location.state || {};
  const isMobile = useMediaQuery("(max-width: 600px)");
  const menuItems = [
    { name: "Осмотр", path: "patient-checkup" },
    { name: "Диагноз", path: "diagnosis" },
    { name: "План лечения", path: "treatment-plan" },

  ];
  return (
    <Box sx={admissionSx.containerMain}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h1" gutterBottom>Прием</Typography>
        <AdmissionInfoForm patientName={patientName}/>
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
            <PatientMenu menuItems={menuItems} />
          </Box>
        )}
        <Box sx={admissionSx.container}>
          {!isMobile && <PatientMenu menuItems={menuItems} />}
          <Box sx={{ flex: 1, mt: isMobile ? 6 : 0, overflow: 'auto' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  )
} 