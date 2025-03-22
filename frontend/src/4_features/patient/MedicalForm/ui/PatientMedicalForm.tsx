import { FC, useState } from "react";
import { Box, Typography } from "@mui/material";
import { InputForm } from "../../../../6_shared/Input";
// import { patientMedicalFormSx } from "./patientMedicalFormSx";
import { CustomButton } from "../../../../6_shared/Button";
import { CustomSnackbar } from "../../../../6_shared/Snackbar";
import { globalsStyleSx } from "../../../../6_shared/styles/globalsStyleSx";
import Grid from '@mui/material/Grid2';


export const PatientMedicalForm: FC = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snils, setSnils] = useState("");
  const [oms, setOms] = useState("");

  // Обработчик СНИЛС
  const handleSnilsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    let formattedValue = "";

    if (value.length > 0) {
      formattedValue += value.substring(0, 3);
    }
    if (value.length > 3) {
      formattedValue += `-${value.substring(3, 6)}`;
    }
    if (value.length > 6) {
      formattedValue += `-${value.substring(6, 9)}`;
    }
    if (value.length > 9) {
      formattedValue += ` ${value.substring(9, 11)}`;
    }

    setSnils(formattedValue);
  };

  // Обработчик полиса ОМС
  const handleOmsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    let formattedValue = "";

    if (value.length > 0) {
      formattedValue += value.substring(0, 4);
    }
    if (value.length > 4) {
      formattedValue += ` ${value.substring(4, 8)}`;
    }
    if (value.length > 8) {
      formattedValue += ` ${value.substring(8, 12)}`;
    }
    if (value.length > 12) {
      formattedValue += ` ${value.substring(12, 16)}`;
    }

    setOms(formattedValue);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Форма отправлена");
    setSnackbarOpen(true); // Показываем уведомление об успешной отправке
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 11, lg: 9 }}>
            <Box>
              <Box sx={globalsStyleSx.inputContainer}>
                <Typography>Полис ОМС</Typography>
                <InputForm
                  type="text"
                  value={oms}
                  onChange={handleOmsChange}
                  fullWidth
                />
              </Box>
              <Box sx={globalsStyleSx.inputContainer}>
                <Typography>СНИЛС</Typography>
                <InputForm
                  type="text"
                  value={snils}
                  onChange={handleSnilsChange}
                  fullWidth
                />
              </Box>
            </Box>
            <CustomButton type="submit" variant="contained">
              Сохранить
            </CustomButton>
          </Grid>
        </Grid>
      </form>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message="Данные успешно сохранены!"
      />
    </Box>
  );
};