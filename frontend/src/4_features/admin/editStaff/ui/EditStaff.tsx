// @ts-nocheck
import { FC } from "react";
import { Modal, Box, Typography } from "@mui/material";
import { InputForm } from "../../../../6_shared/Input";
import { CustomButton } from "../../../../6_shared/Button";

interface EditStaffProps {
    open: boolean;
    onClose: () => void;
    selectedStaff: { id: number; fullName: string; position: string } | null;
    onSave: (staff: { id: number; fullName: string; position: string }) => void;
    onChange: (staff: { id: number; fullName: string; position: string }) => void;
}

export const EditStaff: FC<EditStaffProps> = ({ open, onClose, selectedStaff, onSave, onChange, }) => {
    if (!selectedStaff) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Редактирование сотрудника
                </Typography>
                <Box>
                    <Box sx={{ mb: 1 }}>
                        <InputForm
                            label="ФИО"
                            type="text"
                            fullWidth
                            value={selectedStaff.fullName}
                            onChange={(e) =>
                                onChange({ ...selectedStaff, fullName: e.target.value })
                            }
                        />
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <InputForm
                            label="Позиция"
                            type="text"
                            fullWidth
                            value={selectedStaff.position}
                            onChange={(e) =>
                                onChange({ ...selectedStaff, position: e.target.value })
                            }
                        />
                    </Box>
                    <CustomButton
                        variant="outlined"
                        onClick={() => onSave(selectedStaff)}
                    >
                        Сохранить
                    </CustomButton>
                    <CustomButton variant="outlined" onClick={onClose}>
                        Отмена
                    </CustomButton>
                </Box>
            </Box>
        </Modal>
    );
};