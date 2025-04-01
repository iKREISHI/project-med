import { FC, useState, useEffect } from "react";
import { Modal, Box, Typography, CircularProgress } from "@mui/material";
import { MedicalRecordForm } from "@4_features/admin/medicalRecordForm";
import { CustomButton } from "@6_shared/Button";
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx";
import { MedicalCard } from "@5_entities/medicalCard/model/model";
import { getAllPatients, Patient } from "@5_entities/patient";
import { getMedicalCard } from "@5_entities/medicalCard/api/getMedicalCard";
import { deleteMedicalCard } from "@5_entities/medicalCard/api/deleteMedicalCard";
import { updateMedicalCard } from "@5_entities/medicalCard/api/updateMedicalCard";
import { addNewMedicalCard } from "@5_entities/medicalCard/api/addNewMedicalCard";

interface MedicalRecordEditModalProps {
  open: boolean;
  onClose: () => void;
  recordId?: number;
  onDelete?: (id: number) => void;
  onSuccess?: () => void; 
}

export const MedicalRecordEditModal: FC<MedicalRecordEditModalProps> = ({ 
  open, 
  onClose, 
  recordId, 
  onDelete,
  onSuccess
}) => {
  const [initialData, setInitialData] = useState<Partial<MedicalCard> | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (open && recordId) { 
      const fetchRecordData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const cardData = await getMedicalCard(recordId);
          setInitialData({
            ...cardData,
            date_created: cardData.date_created || new Date().toISOString().split('T')[0]
          });
          
          const patientsResponse = await getAllPatients();
          const patient = patientsResponse.results.find(p => p.id === cardData.client);
          setSelectedPatient(patient || null);
          
        } catch (err) {
          setError("Не удалось загрузить данные медицинской карты");
          console.error("Error fetching medical card data:", err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchRecordData();
    } else if (open) { // Сбрасываем только при открытии модалки
      setInitialData({
        date_created: new Date().toISOString().split('T')[0],
        is_signed: false
      });
      setSelectedPatient(null);
    }
  }, [recordId, open]);

  const handleDelete = async () => {
    if (!recordId) return;
    
    if (window.confirm('Вы уверены, что хотите удалить медицинскую карту?')) {
      try {
        setDeleteLoading(true);
        setError(null);
        
        await deleteMedicalCard(recordId);
        
        onDelete?.(recordId);
        onSuccess?.();
        onClose();
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Ошибка при удалении карты";
        setError(errorMessage);
        console.error("Error deleting medical card:", err);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleSubmit = async (data: MedicalCard) => {
    try {
      setLoading(true);
      setError(null);
      
      if (recordId) {
        await updateMedicalCard(recordId, data);
      } else {
        await addNewMedicalCard(data);
      }
      
      onSuccess?.();
      onClose();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ошибка при сохранении карты";
      setError(errorMessage);
      console.error("Error saving medical card:", err);
    } finally {
      setLoading(false);
    }
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

          {loading && <Typography>Загрузка данных...</Typography>}
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          
          {(!loading && !error) && (
            <>
              <MedicalRecordForm
                initialData={initialData || undefined}
                onSubmit={handleSubmit}
                isEditMode={!!recordId}
                selectedPatient={selectedPatient}
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
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Удалить"
                    )}
                  </CustomButton>
                  <CustomButton 
                    onClick={onClose} 
                    variant="outlined"
                    disabled={deleteLoading}
                  >
                    Отмена
                  </CustomButton>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};