import { FC, useState } from "react";
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

// interface CardView {
//     id: number;
//     name: string;
// }

interface Branch {
    id: number;
    name: string;
}

const cardTypesFromDB: CardType[] = [
    { id: 1, name: "Амбулаторная карта", code: "AMB", description: "Для амбулаторных пациентов" },
    { id: 2, name: "Стационарная карта", code: "STAT", description: "Для стационарных пациентов" },
];

// const cardViews: CardView[] = [
//     { id: 1, name: "Электронная" },
//     { id: 2, name: "Бумажная" },
// ];

const branches: Branch[] = [
    { id: 1, name: "Центральный филиал" },
    { id: 2, name: "Северный филиал" },
];

export const MedicalRecordForm: FC = () => {
    const [formData, setFormData] = useState({
        client: '',
        cardNumber: '',
        cardTypeId: '',
        cardViewId: '',
        closeDate: '',
        signed_date: '',
        registrationDate: new Date().toISOString().split('T')[0],
        comment: '',
        branch: '',
        signedWithES: false,
    });

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
        console.log(formData);
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
                            />
                        </Box>
                        {/* <Box sx={{ mt: 2 }}>
                            <InputForm
                                name="cardNumber"
                                type="text"
                                label="Номер карты"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                fullWidth
                            />
                        </Box> */}
                        <Box sx={{ mt: 2 }}>
                            <CustomSelect
                                value={formData.branch}
                                onChange={handleSelectChange('branch')}
                                options={branches}
                                label="Филиал"
                                fullWidth
                                placeholder="Выберите филиал"
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

                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                name="comment"
                                fullWidth
                                multiline
                                type="text"
                                rows={4}
                                label="Комментарий"
                                value={formData.comment}
                                onChange={handleInputChange}
                            />
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                    <CustomButton
                        type="submit"
                        variant="contained"
                    >
                        Зарегистрировать
                    </CustomButton>
                </Box>
            </form>
        </Box>
    );
};