import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { AddInfoForm } from "../../../4_features/patient/AddInfoForm";

export const AdditionalInfo: FC = () => {
  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h1" gutterBottom>
        Дополнительная информация
      </Typography>
      <AddInfoForm />
    </Box>
  );
};