// @ts-nocheck
import { FC, useState, useEffect } from "react";
import { Box, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { InputForm } from "@6_shared/Input";
import { CustomButton } from "@6_shared/Button";
import { CustomSelect } from "@6_shared/Select";
import Grid from '@mui/material/Grid2';

interface CardType {
    id: number;
    name: string;
    code: string;
    description?: string;
}

interface Branch {
    id: number;
    name: string;
}

interface StaffMember {
    id: number;
    name: string;
    position: string;
}

interface FormData {
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

interface MedicalRecordFormProps {
    initialData?: Partial<FormData>;
    onSubmit?: (data: FormData) => void;
    isEditMode?: boolean;
}

const cardTypesFromDB: CardType[] = [
    { id: 2, name: "Стационарная карта", code: "CODE", description: "Для стационарных пациентов" },
];

const branches: Branch[] = [
    { id: 1, name: "Левый филиал" },
];

const staffMembers: StaffMember[] = [
    { id: 1, name: "Иванов Иван Иванович", position: "Врач" },
];

export const MedicalRecordForm: FC<MedicalRecordFormProps> = ({ 
    initialData = {}, 
    onSubmit, 
    isEditMode = false 
}) => {
    const [formData, setFormData] = useState<FormData>({
        client: '',
        cardNumber: '',
        cardTypeId: '',
        cardViewId: '',
        closeDate: '',
        signed_date: '',
        signed_by: '',
        registrationDate: new Date().toISOString().split('T')[0],
        comment: '',
        branch: '',
        signedWithES: false,
        ...initialData
    });

    useEffect(() => {
        if (isEditMode && initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData
            }));
        }
    }, [initialData, isEditMode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSelectChange = (field: string) => (value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // onSubmit(formData);
    };

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* Левая колонка */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Box>
                            <InputForm
                                name="client"
                                type="text"
                                label="Пациент"
                                value={formData.client}
                                onChange={handleInputChange}
                                required
                                fullWidth
                                disabled={isEditMode} 
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <CustomSelect
                                value={formData.branch}
                                onChange={handleSelectChange('branch')}
                                options={branches}
                                label="Филиал"
                                fullWidth
                                placeholder="Выберите филиал"
                                disabled={isEditMode}
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <CustomSelect
                                value={formData.cardTypeId}
                                onChange={handleSelectChange('cardTypeId')}
                                options={cardTypesFromDB}
                                label="Тип карты"
                                fullWidth
                                placeholder="Выберите тип карты"
                                disabled={isEditMode}
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                name="comment"
                                fullWidth
                                multiline
                                type="text"
                                rows={5}
                                label="Комментарий"
                                value={formData.comment}
                                onChange={handleInputChange}
                            />
                        </Box>
                    </Grid>

                    {/* Правая колонка */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Box>
                            <InputForm
                                name="registrationDate"
                                type="date"
                                label="Дата регистрации"
                                value={formData.registrationDate}
                                onChange={handleInputChange}
                                disabled
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                name="closeDate"
                                type="date"
                                label="Дата закрытия"
                                value={formData.closeDate}
                                onChange={handleInputChange}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                name="signed_date"
                                type="date"
                                label="Дата подписания"
                                value={formData.signed_date}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <CustomSelect
                                value={formData.signed_by}
                                onChange={handleSelectChange('signed_by')}
                                options={staffMembers}
                                label="Кем подписан"
                                fullWidth
                                placeholder="Выберите сотрудника"
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography component="p" sx={{ fontSize: '0.9rem' }}>Статус</Typography>
                            <Box sx={{ m: 0 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="signedWithES"
                                            checked={formData.signedWithES}
                                            onChange={handleInputChange}
                                            disableRipple
                                        />
                                    }
                                    label="Подписано ЭП"
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                    <CustomButton
                        type="submit"
                        variant="contained"
                    >
                        {isEditMode ? "Сохранить изменения" : "Зарегистрировать"}
                    </CustomButton>
                </Box>
            </form>
        </Box>
    );
};