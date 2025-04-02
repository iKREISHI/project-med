// @ts-nocheck
// @ts-nocheck
import { FC } from "react";
import { Box, Typography } from "@mui/material";
import {PatientPassportForm} from "@4_features/patient/PassportForm/ui/PatientPassportForm.tsx";

export const PatientPassport: FC = () => {
  return (
    <Box sx={{p: 1}}>
      <Typography variant="h1" gutterBottom>
        Паспортные данные
      </Typography>
      <PatientPassportForm/>
    </Box>
  );
};