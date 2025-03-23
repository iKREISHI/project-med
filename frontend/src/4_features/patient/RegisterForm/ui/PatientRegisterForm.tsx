import { FC, useState } from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { InputForm } from "../../../../6_shared/Input";
import { CustomButton } from "../../../../6_shared/Button";
import { CustomSnackbar } from "../../../../6_shared/Snackbar";
import { globalsStyleSx } from "../../../../6_shared/styles/globalsStyleSx";
import Grid from '@mui/material/Grid2';


// Форма регистрации пациента
export const PatientRegisterForm: FC = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [bday, setBday] = useState('');
  const [gender, setGender] = useState('');
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
    <Box >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 11, lg: 8 }}>
            <Box sx={globalsStyleSx.inputContainer}>
              <Typography component="p">ФИО</Typography>
              <Box sx={{ ...globalsStyleSx.inputContainer, gridTemplateColumns: { sm: '1fr 1fr 1fr' } }}>
                <InputForm
                  type="text"
                  placeholder="Фамилия"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  fullWidth
                />
                <InputForm
                  type="text"
                  placeholder="Имя"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  fullWidth
                />
                <InputForm
                  type="text"
                  placeholder="Отчество"
                  value={patronymic}
                  onChange={(e) => setPatronymic(e.target.value)}
                  fullWidth
                />
              </Box>
            </Box>
            <Box sx={globalsStyleSx.inputContainer}>
              <Typography component="p">Дата рождения</Typography>
              <InputForm
                type="date"
                value={bday}
                onChange={(e) => setBday(e.target.value)}
                required
                fullWidth
              />
            </Box>
            <Box sx={globalsStyleSx.inputContainer}>
              <Typography component="p">Пол</Typography>
              
              <RadioGroup
                row
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                sx={globalsStyleSx.inputContainer}
              >


                <FormControlLabel
                  value="male"
                  control={<Radio disableRipple />}
                  label="Мужской"
                  sx={{
                    '& .css-1bz1rr0-MuiSvgIcon-root': {
                      zIndex: '1',
                    },
                    '& .css-z8nmqa-MuiSvgIcon-root': {
                      zIndex: '4',
                    }
                  }}
                />
                <FormControlLabel
                  value="female"
                  control={<Radio disableRipple />}
                  label="Женский"
                  sx={{
                    '& .css-1bz1rr0-MuiSvgIcon-root': {
                      zIndex: '1',
                    },
                    '& .css-z8nmqa-MuiSvgIcon-root': {
                      zIndex: '3',
                    },
                  }}

                />
              </RadioGroup>
            </Box>

            <CustomButton
              type="submit"
              variant="contained"
            >
              Зарегистрировать
            </CustomButton>
          </Grid>
        </Grid>
      </form>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message="Пользователь зарегистрирован!"
      />
    </Box>
  );
};