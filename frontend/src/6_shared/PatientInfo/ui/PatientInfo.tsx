import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { PacientInfoForm } from "../../../4_features/patient/InfoForm";

export const PatientInfo: FC = () => {
  return (
    <Box sx={{p: 1}}>
      <Typography variant="h1" gutterBottom>
        Информация пациента
      </Typography>
      <PacientInfoForm />
    </Box>
  );
};