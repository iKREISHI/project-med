import { FC, useState } from "react";
import { Box } from "@mui/material";
import { InputForm } from "../../../../6_shared/Input";
import { patientPassportFormSx } from "./patientPassportFormSx";
import { CustomButton } from "../../../../6_shared/Button";
import { CustomSnackbar } from "../../../../6_shared/Snackbar";

export const PatientPassportForm: FC = () => {
  const [registrationAddress, setRegistrationAddress] = useState("");
  const [passportSeries, setPassportSeries] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");
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

  // Форматирование серии паспорта 
  const formatPassportSeries = (value: string) => {
    const cleaned = value.replace(/\D/g, ""); 
    const limited = cleaned.slice(0, 4); 
    return limited;
  };

  // Форматирование номера паспорта 
  const formatPassportNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, ""); 
    const limited = cleaned.slice(0, 6);
    return limited;
  };

  const handlePassportSeriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPassportSeries(e.target.value);
    setPassportSeries(formattedValue);
  };

  const handlePassportNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPassportNumber(e.target.value);
    setPassportNumber(formattedValue);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Box>
          <Box sx={patientPassportFormSx.inputContainer}>
            <InputForm
              type="text"
              label="Серия"
              value={passportSeries}
              onChange={handlePassportSeriesChange}
            />
            <InputForm
              type="text"
              label="Номер"
              value={passportNumber}
              onChange={handlePassportNumberChange}
            />
          </Box>
          <InputForm
            type="text"
            label="Прописка"
            value={registrationAddress}
            onChange={(e) => setRegistrationAddress(e.target.value)}
          />
          <InputForm
            type="date"
            label="Дата выдачи"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
          <InputForm
            type="text"
            label="Выдавший орган"
            value={issuingAuthority}
            onChange={(e) => setIssuingAuthority(e.target.value)}
          />
        </Box>
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