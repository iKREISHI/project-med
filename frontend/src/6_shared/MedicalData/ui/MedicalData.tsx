import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { PatientMedicalForm } from "../../../4_Features/patient/MedicalForm";

export const MedicalData: FC = () => {
  return (
    <Box sx={{p: 1}}>
      <Typography variant="h1" gutterBottom>
        Медицинские данные
        <PatientMedicalForm />
      </Typography>
    </Box>
  );
};