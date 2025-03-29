import { FC, useState, useEffect } from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { InputForm } from "@6_shared/Input";
import { CustomButton } from "@6_shared/Button";
import { CustomSnackbar } from "@6_shared/Snackbar";
import Grid from '@mui/material/Grid2';
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx";
import { CustomAutocomplete } from "@6_shared/Autocomplete";
import { staffFormSx } from "./staffFormSx";
import { CustomSelect } from "@6_shared/Select";

interface StaffFormProps {
  initialData?: {
    firstname?: string;
    lastname?: string;
    patronymic?: string;
    bday?: string;
    gender?: string;
    divisions?: string;
    snils?: string;
    inn?: string;
    regAddress?: string;
    factAddress?: string;
    email?: string;
    phone?: string;
    position?: string;
    appointmentDuration?: string;
    shortDescription?: string;
    specialization?: string;
  };
  onSubmit?: (data: any) => void;
  isEditMode?: boolean;
}

export const StaffForm: FC<StaffFormProps> = ({ initialData, onSubmit, isEditMode = false }) => {
    const [firstname, setFirstname] = useState(initialData?.firstname || '');
    const [lastname, setLastname] = useState(initialData?.lastname || '');
    const [patronymic, setPatronymic] = useState(initialData?.patronymic || '');
    const [bday, setBday] = useState(initialData?.bday || '');
    const [gender, setGender] = useState(initialData?.gender || '');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [divisions, setDivisions] = useState(initialData?.divisions || "");
    const [snils, setSnils] = useState(initialData?.snils || "");
    const [inn, setInn] = useState(initialData?.inn || "");
    const [regAddress, setRegAddress] = useState(initialData?.regAddress || "");
    const [factAddress, setFactAddress] = useState(initialData?.factAddress || "");
    const [email, setEmail] = useState(initialData?.email || "");
    const [phone, setPhone] = useState(initialData?.phone || "");
    const [position, setPosition] = useState(initialData?.position || "");
    const [appointmentDuration, setAppointmentDuration] = useState(initialData?.appointmentDuration || "");
    const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || "");
    const [specialization, setSpecialization] = useState(initialData?.specialization || "");

    useEffect(() => {
        if (initialData) {
            setFirstname(initialData.firstname || '');
            setLastname(initialData.lastname || '');
            setPatronymic(initialData.patronymic || '');
            setBday(initialData.bday || '');
            setGender(initialData.gender || '');
            setDivisions(initialData.divisions || "");
            setSnils(initialData.snils || "");
            setInn(initialData.inn || "");
            setRegAddress(initialData.regAddress || "");
            setFactAddress(initialData.factAddress || "");
            setEmail(initialData.email || "");
            setPhone(initialData.phone || "");
            setPosition(initialData.position || "");
            setAppointmentDuration(initialData.appointmentDuration || "");
            setShortDescription(initialData.shortDescription || "");
            setSpecialization(initialData.specialization || "");
        }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = {
            firstname,
            lastname,
            patronymic,
            bday,
            gender,
            divisions,
            snils,
            inn,
            regAddress,
            factAddress,
            email,
            phone,
            position,
            appointmentDuration,
            shortDescription,
            specialization
        };

        if (onSubmit) {
            onSubmit(formData);
        }
        
        setSnackbarOpen(true);
    };

    const divisions_list = [
        { id: 1, name: "division 1" },
        { id: 2, name: "division 2" },
    ];

    const positions_list = [
        { id: 1, name: "Врач-терапевт" },
        { id: 2, name: "Хирург" },
    ];

    const specializations_list = [
        { id: 1, name: "Терапия" },
        { id: 2, name: "Хирургия" },
    ];

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                    {/* Левая колонка */}
                    <Grid size={{ xs: 12, lg: 8 }}>
                        <Box>
                            <Box sx={{ ...globalsStyleSx.inputContainer, m: 0, gridTemplateColumns: { sm: '1fr 1fr 1fr' } }}>
                                <InputForm
                                    type="text"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    required
                                    fullWidth
                                    label="Фамилия"
                                />
                                <InputForm
                                    type="text"
                                    label="Имя"
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <InputForm
                                    type="text"
                                    label="Отчество"
                                    value={patronymic}
                                    onChange={(e) => setPatronymic(e.target.value)}
                                    fullWidth
                                />
                            </Box>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                type="date"
                                label="Дата рождения"
                                value={bday}
                                onChange={(e) => setBday(e.target.value)}
                                required
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography component="p" sx={{ fontSize: '0.9rem' }}>Пол</Typography>
                            <RadioGroup
                                row
                                name="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                sx={{ ...staffFormSx.inputContainer, m: 0 }}
                            >
                                <Box sx={{ ...globalsStyleSx.inputContainer, m: 0, gridTemplateColumns: { sm: '1fr 1fr 1fr' } }}>
                                    <FormControlLabel value="M" control={<Radio disableRipple />} sx={staffFormSx.radioCheck} label="Мужской" />
                                    <FormControlLabel value="F" control={<Radio disableRipple />} sx={staffFormSx.radioCheck} label="Женский" />
                                    <FormControlLabel value="U" control={<Radio disableRipple />} sx={staffFormSx.radioCheck} label="Не указан" />
                                </Box>
                            </RadioGroup>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                type="email"
                                label="Почта"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                required
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                type="tel"
                                label="Номер телефона"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                fullWidth
                                required
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                type="text"
                                label="ИНН"
                                placeholder=""
                                value={inn}
                                onChange={(e) => setInn(e.target.value)}
                                fullWidth
                                required
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                label="СНИЛС"
                                type="text"
                                value={snils}
                                onChange={(e) => setSnils(e.target.value)}
                                fullWidth
                                required
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                type="text"
                                label="Адрес регистрации"
                                value={regAddress}
                                onChange={(e) => setRegAddress(e.target.value)}
                                fullWidth
                                required
                            />
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                type="text"
                                label="Адрес проживания"
                                value={factAddress}
                                onChange={(e) => setFactAddress(e.target.value)}
                                fullWidth
                            />
                        </Box>
                    </Grid>

                    {/* Правая колонка */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                label="Длительность приема (мин)"
                                type="number"
                                value={appointmentDuration}
                                onChange={(e) => setAppointmentDuration(e.target.value)}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <CustomAutocomplete
                                value={divisions}
                                onChange={setDivisions}
                                options={divisions_list}
                                placeholder="Введите подразделение"
                                label="Подразделение"
                                required
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <CustomAutocomplete
                                value={position}
                                onChange={setPosition}
                                options={positions_list}
                                placeholder="Выберите должность"
                                label="Должность"
                                required                                
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <CustomSelect
                                value={specialization}
                                onChange={setSpecialization}
                                options={specializations_list}
                                placeholder="Выберите специализацию"
                                label="Специализация"
                                fullWidth
                                disabled={!position}
                                required
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                fullWidth
                                multiline
                                type="text"
                                rows={5}
                                label="Краткое описание"
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                                placeholder="Введите краткое описание"
                            />
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

            <CustomSnackbar
                open={snackbarOpen}
                onClose={handleCloseSnackbar}
                message={isEditMode ? "Данные сотрудника обновлены!" : "Сотрудник создан!"}
            />
        </Box>
    );
};