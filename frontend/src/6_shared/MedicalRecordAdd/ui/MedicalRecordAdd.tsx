import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { MedicalRecordForm } from "@4_features/medicalRecordForm";
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx";

export const MedicalRecordAdd: FC = () => {
  return (
    <Box sx={{ ...globalsStyleSx.container, overflow: 'hidden' }}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h1" gutterBottom sx={{mb: 4}}>Регистрация медицинской карты</Typography>
        <MedicalRecordForm />
      </Box>
    </Box>
  );
};
