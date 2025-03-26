import React, { useEffect, useState } from "react";
import {
  Box,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Stack,
  Divider
} from "@mui/material";
import { CustomButton } from "@6_shared/Button";
import { getPatient, updatePatient, Patient } from "@5_entities/patient";
import { patientRegisterFormSx } from "@4_features/patient/RegisterForm/ui/patientRegisterFormSx.ts";
import { InputForm } from "@6_shared/Input";

interface EditPatientModalProps {
  open: boolean;
  onClose: () => void;
  patientId: number | null;
  onUpdate: () => void;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = ({
                                                                    open,
                                                                    onClose,
                                                                    patientId,
                                                                    onUpdate,
                                                                  }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patientId) {
      setLoading(true);
      getPatient(patientId)
        .then(setPatient)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [patientId]);

  const handleSave = async () => {
    if (!patient) return;

    try {
      setLoading(true);
      await updatePatient(patient.id, patient);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Ошибка обновления пациента", error);
    } finally {
      setLoading(false);
    }
  };

  if (!patient) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1000,
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          maxHeight: "80vh", // Ограничение высоты
          overflowY: "auto", // Включение вертикального скролла
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Редактирование пациента
        </Typography>

        {/* Основная информация */}
        <SectionBlock title="Основная информация">
          <Stack spacing={2}>
            <TextField
              label="Фамилия"
              fullWidth
              value={patient.last_name}
              onChange={(e) => setPatient({ ...patient, last_name: e.target.value })}
            />
            <TextField
              label="Имя"
              fullWidth
              value={patient.first_name}
              onChange={(e) => setPatient({ ...patient, first_name: e.target.value })}
            />
            <TextField
              label="Отчество"
              fullWidth
              value={patient.patronymic}
              onChange={(e) => setPatient({ ...patient, patronymic: e.target.value })}
            />
          </Stack>
        </SectionBlock>

        <Divider sx={{ my: 3 }} />

        {/* Персональные данные */}
        <SectionBlock title="Персональные данные">
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Пол
              </Typography>
              <RadioGroup
                row
                name="gender"
                value={patient.gender}
                onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
                sx={patientRegisterFormSx.inputContainer}
              >
                <FormControlLabel value="M" control={<Radio disableRipple />} label="Мужской" />
                <FormControlLabel value="F" control={<Radio disableRipple />} label="Женский" />
                <FormControlLabel value="U" control={<Radio disableRipple />} label="Не указан" />
              </RadioGroup>
            </Box>

            <InputForm
              label="Дата рождения"
              type="date"
              required
              value={patient.date_of_birth || ""}
              onChange={(e) => setPatient({ ...patient, date_of_birth: e.target.value })}
            />
          </Stack>
        </SectionBlock>

        <Divider sx={{ my: 3 }} />

        {/* Документы */}
        <SectionBlock title="Документы">
          <Stack spacing={2}>
            <TextField
              label="СНИЛС"
              fullWidth
              value={patient.snils || ""}
              onChange={(e) => setPatient({ ...patient, snils: e.target.value })}
            />
            <TextField
              label="ИНН"
              fullWidth
              value={patient.inn || ""}
              onChange={(e) => setPatient({ ...patient, inn: e.target.value })}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Серия паспорта"
                fullWidth
                value={patient.passport_series || ""}
                onChange={(e) => setPatient({ ...patient, passport_series: e.target.value })}
              />
              <TextField
                label="Номер паспорта"
                fullWidth
                value={patient.passport_number || ""}
                onChange={(e) => setPatient({ ...patient, passport_number: e.target.value })}
              />
            </Stack>
          </Stack>
        </SectionBlock>

        <Divider sx={{ my: 3 }} />

        {/* Контактная информация */}
        <SectionBlock title="Контактная информация">
          <Stack spacing={2}>
            <TextField
              label="Телефон"
              fullWidth
              value={patient.phone || ""}
              onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              value={patient.email || ""}
              onChange={(e) => setPatient({ ...patient, email: e.target.value })}
            />
          </Stack>
        </SectionBlock>

        <Divider sx={{ my: 3 }} />

        {/* Действия */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <CustomButton onClick={onClose} variant="outlined" disabled={loading}>
            Отмена
          </CustomButton>
          <CustomButton onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить изменения"}
          </CustomButton>
        </Box>
      </Box>
    </Modal>
  );
};

// Вспомогательный компонент для секций
const SectionBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" gutterBottom sx={{ color: "text.secondary" }}>
      {title}
    </Typography>
    {children}
  </Box>
);
