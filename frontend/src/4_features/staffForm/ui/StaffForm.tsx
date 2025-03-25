import { FC, useState } from "react";
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { InputForm } from "@6_shared/Input";
import { CustomButton } from "@6_shared/Button";
import { CustomSnackbar } from "@6_shared/Snackbar";
import Grid from '@mui/material/Grid2';
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx";
import { CustomAutocomplete } from "@6_shared/Autocomplete";
import { staffFormSx } from "./staffFormSx";
import { CustomSelect } from "@6_shared/Select";

// Форма регистрации сотрудника
export const StaffForm: FC = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [bday, setBday] = useState('');
    const [gender, setGender] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [divisions, setDivisions] = useState("");
    const [snils, setSnils] = useState("");
    const [inn, setInn] = useState("");
    const [regAddress, setRegAddress] = useState("");
    const [factAddress, setFactAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [position, setPosition] = useState("");
    const [appointmentDuration, setAppointmentDuration] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [specialization, setSpecialization] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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
                            <Typography component="p" sx={{ fontSize: '0.9rem' }}>ФИО</Typography>
                            <Box sx={{ ...globalsStyleSx.inputContainer, m: 0, gridTemplateColumns: { sm: '1fr 1fr 1fr' } }}>
                                <InputForm
                                    type="text"
                                    placeholder="Фамилия"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <InputForm
                                    type="text"
                                    placeholder="Имя"
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <InputForm
                                    type="text"
                                    placeholder="Отчество"
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
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                type="tel"
                                label="Номер телефона"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                fullWidth
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
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                label="СНИЛС"
                                type="text"
                                value={snils}
                                onChange={(e) => setSnils(e.target.value)}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                type="text"
                                label="Адрес регистрации"
                                value={regAddress}
                                onChange={(e) => setRegAddress(e.target.value)}
                                fullWidth
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
                                placeholder="30"
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
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <CustomAutocomplete
                                value={position}
                                onChange={setPosition}
                                options={positions_list}
                                placeholder="Выберите должность"
                                label="Должность"
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
                                disabled={!position} // доступным только если выбрана должность
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
                        Зарегистрировать
                    </CustomButton>
                </Box>
            </form>

            <CustomSnackbar
                open={snackbarOpen}
                onClose={handleCloseSnackbar}
                message="Сотрудник создан!"
            />
        </Box>
    );
};