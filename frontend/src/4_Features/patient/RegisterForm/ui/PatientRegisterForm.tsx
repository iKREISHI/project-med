import { FC, useState } from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { InputForm } from "../../../../6_shared/Input";
import { patientRegisterFormSx } from "./patientRegisterFormSx";
import { CustomButton } from "../../../../6_shared/Button";
import { CustomSnackbar } from "../../../../6_shared/Snackbar";

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
        <Box sx={patientRegisterFormSx.inputContainer}>
          <Typography component="p">ФИО</Typography>
          <InputForm
            type="text"
            placeholder="Фамилия*"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
          <InputForm
            type="text"
            placeholder="Имя*"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
          <InputForm
            type="text"
            placeholder="Отчество"
            value={patronymic}
            onChange={(e) => setPatronymic(e.target.value)}
          />
        </Box>
        <Box sx={patientRegisterFormSx.inputContainer}>
          <Typography component="p">Дата рождения*</Typography>
          <InputForm
            type="date"
            value={bday}
            onChange={(e) => setBday(e.target.value)}
            required
          />
        </Box>
        <RadioGroup
          row
          name="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          sx={patientRegisterFormSx.inputContainer}
        >
          <Typography component="p">Пол</Typography>

          <FormControlLabel
            value="male"
            control={<Radio disableRipple />}
            label="Мужской"
          />
          <FormControlLabel
            value="female"
            control={<Radio disableRipple />}
            label="Женский"

          />
        </RadioGroup>

        <CustomButton
          type="submit"
          variant="contained"
        >
          Зарегистрировать
        </CustomButton>
      </form>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message="Пользователь зарегистрирован!"
      />
    </Box>
  );
};