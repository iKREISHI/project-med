import { FC, useState, useEffect } from "react";
import { Box, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { InputForm } from "../../../../6_Shared/Input";
// import { pacientInfoFormSx } from "./pacientInfoFormSx";
import { CustomButton } from "../../../../6_Shared/Button";
import { CustomSnackbar } from "../../../../6_Shared/Snackbar";

export const PatientAddressesForm: FC = () => {
  const [registrationAddress, setRegistrationAddress] = useState('');
  const [residenceAddress, setResidenceAddress] = useState('');
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);


  // Сравниваем адреса при изменении
  useEffect(() => {
    if (registrationAddress === residenceAddress && registrationAddress !== "") {
      setIsSameAddress(true);
    } else {
      setIsSameAddress(false);
    }
  }, [registrationAddress, residenceAddress]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSameAddress(event.target.checked);
    if (event.target.checked) {
      setResidenceAddress(registrationAddress);
    } else {
      setResidenceAddress('');
    }
  };


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
        <Box>
          <Box>
            <InputForm
              type="text"
              label="Адрес прописки*"
              value={registrationAddress}
              onChange={(e) => setRegistrationAddress(e.target.value)}
              required
            />
            <InputForm
              type="text"
              label="Адрес проживания*"
              value={residenceAddress}
              onChange={(e) => setResidenceAddress(e.target.value)}
              required
            />
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={isSameAddress}
                onChange={handleCheckboxChange}
                disableRipple
              />
            }
            label="Адрес проживания совпадает с адресом прописки"
          />
        </Box>
        <CustomButton
          type="submit"
          variant="contained"
        >
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
