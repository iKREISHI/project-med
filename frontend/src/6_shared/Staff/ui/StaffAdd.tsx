import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { staffSx } from "./staffSx";
import { StaffForm } from "@4_features/admin/staffForm";

export const StaffAdd: FC = () => {
  return (
    <Box sx={staffSx.containerMain}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h1" gutterBottom sx={{mb: 4}}>Регистрация сотрудника</Typography>
        <StaffForm />
      </Box>
    </Box>
  );
};
