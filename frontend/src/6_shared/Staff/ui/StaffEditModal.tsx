// @ts-nocheck
// @ts-nocheck
import { FC, useState, useEffect } from "react";
import { Modal, Box, Typography } from "@mui/material";
import { staffSx } from "./staffSx";
import { StaffForm } from "@4_features/admin/staffForm";
import { CustomButton } from "@6_shared/Button";

interface StaffEditModalProps {
  open: boolean;
  onClose: () => void;
  staffId?: number;
  onDelete?: (id: number) => void;
}

interface StaffData {
  lastname: string;
  firstname: string;
  patronymic: string;
  position: string;
}
export const StaffEditModal: FC<StaffEditModalProps> = ({ 
  open, 
  onClose, 
  staffId, 
}) => {
  const [staffData, setStaffData] = useState<StaffData | null>(null);

  useEffect(() => {
    if (staffId) {
      const fetchStaffData = async () => {
        const mockData = {
          lastname: "Иванов",
          firstname: "Иван",
          patronymic: "Иванович",
          position: "Главный врач"
        };
        setStaffData(mockData);
      };
      fetchStaffData();
    }
  }, [staffId]);

  const handleDelete = ()=> {
    if (window.confirm('Вы уверены, что хотите удалить сотрудника?')) {
      alert('Сотрудник удалена');
    }
  };

  const handleSubmit = (data: StaffData) => {
    console.log("Сохранение изменений:", data);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="staff-edit-modal"
      aria-describedby="staff-editing-form"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box sx={{
        ...staffSx.containerMain,
        width: 'auto',
        maxWidth: {lg:'70vw', xs:'90vw'}, 
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h1" gutterBottom sx={{ mb: 4 }}>
            Редактирование сотрудника
          </Typography>
          {staffData && (
            <StaffForm 
              initialData={staffData}
              onSubmit={handleSubmit}
              isEditMode
            />
          )}
          
          <Box sx={{ display: 'flex', justifyContent: {lg:'flex-end'}, mt: 1, gap: 1 }}>
  
            <CustomButton
                variant="outlined"
                onClick={handleDelete}
                color="error"
              >
                Удалить
              </CustomButton>
              <CustomButton onClick={onClose} variant="outlined">Отмена</CustomButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};