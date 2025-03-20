import { FC, useState } from "react";
import { Box, TextField } from "@mui/material";
import { CustomButton } from "../../../../6_shared/Button";
import { CustomSnackbar } from "../../../../6_shared/Snackbar";
import Grid from '@mui/material/Grid2';
import { InputForm } from "../../../../6_shared";


export const AddInfoForm: FC = () => {
  const [additionalInfo, setAdditionalInfo] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Форма отправлена");
    setSnackbarOpen(true); // Показываем уведомление об успешной отправке

  };

  // Скрываем уведомление
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 11, lg: 9 }}>
            <InputForm
              fullWidth
              multiline
              type="text"
              rows={4}
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Дополнительная информация"
             
            />
            <Box sx={{ mt: 1 }}>
              <CustomButton
                type="submit"
                variant="contained"
              >
                Сохранить
              </CustomButton>
            </Box>
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
