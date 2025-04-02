// @ts-nocheck
// @ts-nocheck
import { FC} from "react";
import { Box } from "@mui/material";
import { InputForm } from "../../../../6_shared/Input";
import { patientPassportFormSx } from "./patientPassportFormSx";
import {usePatientFormStore} from "../../model/store.ts";

export const PatientPassportForm: FC = () => {
  const {patient, setField} = usePatientFormStore();

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

  //Изменения серии паспорта
  const handlePassportSeriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPassportSeries(e.target.value);
    setField('passport_series',formattedValue);
  };

  //Изменение номера паспорта
  const handlePassportNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPassportNumber(e.target.value);
    setField('passport_number', formattedValue);
  };

  return (
    <Box sx={{mt: 3}}>
      <form>
        <Box>
          <Box sx={{...patientPassportFormSx.inputContainer, mb: 2}}>
            <InputForm
              type="text"
              label="Серия"
              value={patient.passport_series || ''}
              onChange={handlePassportSeriesChange}
            />
            <InputForm
              type="text"
              label="Номер"
              value={patient.passport_number || ''}
              onChange={handlePassportNumberChange}
            />
          </Box>
          <InputForm
            type="text"
            label="Прописка"
            value={patient.registration_address || ''}
            onChange={(e) => setField('registration_address', e.target.value)}
          />
        </Box>
      </form>
    </Box>
  );
};