import { FC, useState } from "react";
import { Box } from "@mui/material";
import { InputForm } from "../../../../6_shared/Input";
import { patientInfoFormSx } from "./patientInfoFormSx";
import { CustomButton } from "../../../../6_shared/Button";
import { CustomSnackbar } from "../../../../6_shared/Snackbar";

export const PacientInfoForm: FC = () => {
  const [email, setEmail] = useState("");
  const [mobiletel, setMobiletel] = useState("");
  const [hometel, setHometel] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Форма отправлена");
    setSnackbarOpen(true); // Показываем уведомление об успешной отправке
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Скрываем уведомление
  };

  // Форматирование номера телефона
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const limited = cleaned.slice(0, 11);

    let formatted = "+7 ";
    if (limited.length > 1) {
      formatted += `(${limited.slice(1, 4)}`;
    }
    if (limited.length > 4) {
      formatted += `) ${limited.slice(4, 7)}`;
    }
    if (limited.length > 7) {
      formatted += `-${limited.slice(7, 9)}`;
    }
    if (limited.length > 9) {
      formatted += `-${limited.slice(9, 11)}`;
    }
    return formatted;
  };

  // Обработчик изменения для мобильного телефона
  const handleMobileTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setMobiletel(formattedValue);
  };

  // Обработчик изменения для домашнего телефона
  const handleHomeTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setHometel(formattedValue);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Box>
          <Box sx={patientInfoFormSx.inputContainer}>
            <InputForm
              type="text"
              label="Домашний телефон"
              value={hometel}
              onChange={handleHomeTelChange}
            />
            <InputForm
              type="text"
              label="Мобильный телефон"
              value={mobiletel}
              onChange={handleMobileTelChange}
            />
          </Box>
        </Box>
        <InputForm
          type="email"
          label="Адрес электронной почты"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <CustomButton type="submit" variant="contained">
          Сохранить
        </CustomButton>
      </form>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message="Данные успешно сохранены!"
      />
    </Box>
  );
};