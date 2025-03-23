import { FC } from "react";
import { Box, Typography } from "@mui/material";
import {PatientAddForm} from "../../../../4_Features/patient/AddInfoForm/ui/PatientAddForm.tsx";

export const AdditionalInfo: FC = () => {
  return (
    <Box sx={{p: 1}}>
      <Typography variant="h1" gutterBottom>
        Дополнительная информация
      </Typography>
      <PatientAddForm/>
    </Box>
  );
};