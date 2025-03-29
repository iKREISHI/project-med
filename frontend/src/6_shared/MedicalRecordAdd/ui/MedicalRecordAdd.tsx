import { FC } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { MedicalRecordForm } from "@4_features/admin/medicalRecordForm";
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const MedicalRecordAdd: FC = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ ...globalsStyleSx.container, overflow: 'hidden' }}>
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }} disableRipple>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h2">Регистрация медицинской карты</Typography>
        </Box>
        <MedicalRecordForm />
      </Box>
    </Box>
  );
};
