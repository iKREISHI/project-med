import { FC} from "react";
import { Box } from "@mui/material";
import { InputForm } from "../../../../6_shared/Input";
import { patientInfoFormSx } from "./patientInfoFormSx";
import {usePatientFormStore} from "../../model/store.ts";

export const PacientInfoForm: FC = () => {

  const {patient, setField} = usePatientFormStore();

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
    setField('phone', formattedValue);
  };
  return (
    <Box>
      <form>
        <Box>
          <Box sx={patientInfoFormSx.inputContainer}>
            <InputForm
              type="text"
              label="Мобильный телефон"
              value={patient.phone || ''}
              onChange={(e) => setField('phone',e.target.value)}
            />
          </Box>
        </Box>
        <InputForm
          type="email"
          label="Адрес электронной почты"
          value={patient.email || ''}
          onChange={(e) => setField('email', e.target.value)}
        />

      </form>
    </Box>
  );
};