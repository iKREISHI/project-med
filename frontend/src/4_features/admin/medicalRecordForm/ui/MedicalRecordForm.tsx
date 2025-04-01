import { FC, useState, useEffect } from "react";
import { Box, Typography, FormControlLabel, Checkbox, CircularProgress } from "@mui/material";
import { InputForm } from "@6_shared/Input";
import { CustomButton } from "@6_shared/Button";
import { CustomAutocomplete } from "@6_shared/Autocomplete";
import Grid from '@mui/material/Grid2';
import { Patient } from "@5_entities/patient/model/model";
import { getAllMedicalCardType } from "@5_entities/medicalCardType/api/getAllMedicalCardType";
import { getAllFilials } from "@5_entities/filial/api/getAllFilials";
import { getAllEmployee } from "@5_entities/emloyee/api/getAllEmployee";
import { addNewMedicalCard } from "@5_entities/medicalCard/api/addNewMedicalCard";
import { getAllPatients } from "@5_entities/patient/api/getAllPatients";
import { CustomSnackbar } from "@6_shared/Snackbar";

interface CardType {
    id: number;
    name: string;
}

interface Branch {
    id: number;
    name: string;
}

interface StaffMember {
    id: number;
    full_name: string;
    position: string;
}

interface PatientOption {
    id: number;
    full_name: string;
}

interface FormData {
    name: string;
    client: number | null;
    number: string;
    card_type: number | null;
    filial: number | null;
    date_signed: string;
    signed_by: number | null;
    comment: string;
    is_signed: boolean;
}

interface MedicalRecordFormProps {
    initialData?: Partial<FormData>;
    onSubmit?: (data: FormData) => void;
    isEditMode?: boolean;
    selectedPatient?: Patient | null;
}

export const MedicalRecordForm: FC<MedicalRecordFormProps> = ({
    initialData = {},
    onSubmit,
    isEditMode = false,
    selectedPatient = null
}) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        client: null,
        number: '',
        card_type: null,
        filial: null,
        date_signed: '',
        signed_by: null,
        comment: '',
        is_signed: false,
        ...initialData
    });

    const [cardTypes, setCardTypes] = useState<CardType[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
    const [patients, setPatients] = useState<PatientOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingOptions, setLoadingOptions] = useState({
        staff: false,
        cardTypes: false,
        branches: false,
        patients: false
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const showSuccessMessage = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    };

    const showErrorMessage = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
    };

    // Загрузка справочников при монтировании
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoadingOptions(prev => ({ ...prev, cardTypes: true }));
                const cardTypesResponse = await getAllMedicalCardType();
                setCardTypes(cardTypesResponse.results);

                setLoadingOptions(prev => ({ ...prev, branches: true }));
                const branchesResponse = await getAllFilials();
                setBranches(branchesResponse.results);

                setLoadingOptions(prev => ({ ...prev, staff: true }));
                const staffResponse = await getAllEmployee({});
                setStaffMembers(staffResponse.results.map(member => ({
                    id: member.id,
                    full_name: `${member.last_name} ${member.first_name} ${member.patronymic || ''}`.trim(),
                    position: member.position || 'Сотрудник'
                })));

                setLoadingOptions(prev => ({ ...prev, patients: true }));
                const patientsResponse = await getAllPatients({});
                setPatients(patientsResponse.results.map(patient => ({
                    id: patient.id,
                    full_name: `${patient.last_name} ${patient.first_name} ${patient.patronymic || ''}`.trim()
                })));

            } catch (err) {
                showErrorMessage("Не удалось загрузить справочные данные");
                console.error("Error loading reference data:", err);
            } finally {
                setLoadingOptions({
                    staff: false,
                    cardTypes: false,
                    branches: false,
                    patients: false
                });
            }
        };

        loadData();
    }, []);

    // Установка выбранного пациента
    useEffect(() => {
        if (selectedPatient) {
            setFormData(prev => ({
                ...prev,
                client: selectedPatient.id
            }));
        }
    }, [selectedPatient]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAutocompleteChange = (field: string) => (value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value ? value.id : null
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            // Подготовка данных для API
            const apiData = {
                name: formData.name,
                client: formData.client,
                number: formData.number,
                card_type: formData.card_type,
                filial: formData.filial,
                signed_date: formData.date_signed || new Date().toISOString(),
                signed_by: formData.signed_by || null,
                comment: formData.comment || '',
                is_signed: formData.is_signed
            };

            // Вызов API
            const response = await addNewMedicalCard(apiData);

            // Успешное создание
            if (onSubmit) {
                onSubmit(response);
            }

            showSuccessMessage(isEditMode ? "Карта успешно обновлена!" : "Карта успешно создана!");

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Ошибка при создании карты";
            showErrorMessage(errorMessage);
            console.error("Error creating medical card:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loadingOptions.cardTypes || loadingOptions.branches || loadingOptions.staff || loadingOptions.patients) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* Левая колонка */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Box>
                            <InputForm
                                name="name"
                                type="text"
                                label="Название карты"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <CustomAutocomplete<PatientOption>
                                value={patients.find(p => p.id === formData.client) || null}
                                onChange={handleAutocompleteChange('client')}
                                options={patients}
                                placeholder="Выберите пациента"
                                label="Пациент"
                                fullWidth
                                disabled={isEditMode}
                                required
                                getOptionLabel={(option) => option.full_name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                loading={loadingOptions.patients}
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <CustomAutocomplete<Branch>
                                value={branches.find(b => b.id === formData.filial) || null}
                                onChange={handleAutocompleteChange('filial')}
                                options={branches}
                                placeholder="Выберите филиал"
                                label="Филиал"
                                fullWidth
                                disabled={isEditMode}
                                required
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                loading={loadingOptions.branches}
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <CustomAutocomplete<CardType>
                                value={cardTypes.find(t => t.id === formData.card_type) || null}
                                onChange={handleAutocompleteChange('card_type')}
                                options={cardTypes}
                                placeholder="Выберите тип карты"
                                label="Тип карты"
                                fullWidth
                                disabled={isEditMode}
                                required
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                loading={loadingOptions.cardTypes}
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                name="comment"
                                fullWidth
                                multiline
                                type="text"
                                rows={3}
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
                                name="number"
                                type="text"
                                label="Номер карты"
                                value={formData.number}
                                onChange={handleInputChange}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                name="date_signed"
                                type="date"
                                label="Дата подписания"
                                value={formData.date_signed}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <CustomAutocomplete<StaffMember>
                                value={staffMembers.find(m => m.id === formData.signed_by) || null}
                                onChange={handleAutocompleteChange('signed_by')}
                                options={staffMembers}
                                placeholder="Выберите сотрудника"
                                label="Кем подписан"
                                fullWidth
                                getOptionLabel={(option) => option.full_name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                loading={loadingOptions.staff}
                                required
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography component="p" sx={{ fontSize: '0.9rem' }}>Статус</Typography>
                            <Box sx={{ m: 0 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="is_signed"
                                            checked={formData.is_signed}
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
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : isEditMode ? (
                            "Сохранить изменения"
                        ) : (
                            "Зарегистрировать"
                        )}
                    </CustomButton>
                </Box>
            </form>

            <CustomSnackbar
                open={snackbarOpen}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
            />
        </Box>
    );
};