import { FC } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { staffSx } from "./staffSx";
import { StaffForm } from "@4_features/admin/staffForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";


export const StaffAdd: FC = () => { 
  const navigate = useNavigate();
  return (
    <Box sx={staffSx.containerMain}>
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }} disableRipple>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h2">Регистрация сотрудника</Typography>
        </Box>
        <StaffForm />
      </Box>
    </Box>
  );
};
