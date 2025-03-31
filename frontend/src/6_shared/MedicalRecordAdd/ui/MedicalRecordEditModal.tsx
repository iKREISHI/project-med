import { FC, useState, useEffect } from "react";
import { Modal, Box, Typography } from "@mui/material";
import { MedicalRecordForm } from "@4_features/admin/medicalRecordForm";
import { CustomButton } from "@6_shared/Button";
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx";

interface MedicalRecordEditModalProps {
  open: boolean;
  onClose: () => void;
  recordId?: number;
  onDelete?: (id: number) => void;
}

interface MedicalRecordData {
  client: string;
  cardNumber: string;
  cardTypeId: string;
  cardViewId: string;
  closeDate: string;
  signed_date: string;
  signed_by: string;
  registrationDate: string;
  comment: string;
  branch: string;
  signedWithES: boolean;
}

export const MedicalRecordEditModal: FC<MedicalRecordEditModalProps> = ({ open, onClose, recordId, }) => {
  const [recordData, setRecordData] = useState<MedicalRecordData | null>(null);

  useEffect(() => {
    if (recordId) {
      const fetchRecordData = async () => {
        const mockData: MedicalRecordData = {
          client: "Иванов Иван Иванович",
          cardNumber: "MR-2023-001",
          cardTypeId: "2",
          cardViewId: "1",
          closeDate: "",
          signed_date: "2023-05-15",
          signed_by: "1",
          registrationDate: "2023-05-10",
          comment: "Пациент с хроническим заболеванием",
          branch: "1",
          signedWithES: true
        };
        setRecordData(mockData);
      };
      fetchRecordData();
    }
  }, [recordId]);

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить медицинскую карту?')) {
      alert("Медицинская карта удалена");
    }
  };

  const handleSubmit = (data: MedicalRecordData) => {
    console.log("Сохранение изменений медкарты:", data);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="medical-record-edit-modal"
      aria-describedby="medical-record-editing-form"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box sx={{
        ...globalsStyleSx.container,
        width: { lg: '50vw', xs: 'auto' },
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h1" gutterBottom sx={{ mb: 4 }}>
            {recordId ? "Редактирование медкарты" : "Создание медкарты"}
          </Typography>

          <MedicalRecordForm
            initialData={recordData || undefined}
            onSubmit={handleSubmit}
            isEditMode={!!recordId}
          />

          {recordId && (
            <Box sx={{
              display: 'flex',
              justifyContent: { lg: 'flex-end' },
              mt: 3,
              gap: 1
            }}>
              <CustomButton
                variant="outlined"
                onClick={handleDelete}
                color="error"
              >
                Удалить
              </CustomButton>
              <CustomButton onClick={onClose} variant="outlined">Отмена</CustomButton>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};