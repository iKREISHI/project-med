import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { PatientAddressesForm } from "../../../4_Features/patient/AddressesForm";

export const PatientAddresses: FC = () => {
  return (
    <Box sx={{p: 1}}>
      <Typography variant="h1" gutterBottom>
        Адреса пациента
      </Typography>
      <PatientAddressesForm />
    </Box>
  );
};