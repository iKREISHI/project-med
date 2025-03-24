import { FC, useState } from "react";
import { Box, Typography } from "@mui/material";
import { InputForm } from "../../../../6_shared/Input";
import { CustomButton } from "../../../../6_shared/Button";
import { CustomSnackbar } from "../../../../6_shared/Snackbar";
import { CustomSelect } from "../../../../6_shared/Select";
import { CustomAutocomplete } from "../../../../6_shared/Autocomplete";
import { globalsStyleSx } from "../../../../6_shared/styles/globalsStyleSx.ts";
import Grid from '@mui/material/Grid2';


// Форма записи пациента 
export const RecordForm: FC = () => {
    const [doctor, setDoctor] = useState("");
    const [client, setClient] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const doctors = [
        { id: 1, name: "Иванов" },
        { id: 2, name: "Петров" },
    ];

    const clients = [
        { id: 1, name: "Иван Иванов" },
        { id: 2, name: "Петр Петров" },
    ];

    const availableTimes = [
        { id: 1, time: "09:00", isAvailable: true },
        { id: 2, time: "10:00", isAvailable: false },
        { id: 3, time: "11:00", isAvailable: true },
        { id: 4, time: "12:00", isAvailable: true },
        { id: 5, time: "13:00", isAvailable: false },
    ];

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSnackbarOpen(true);
    };

    // Скрываем уведомление
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 11, lg: 7 }}>
                        {/* Выбор врача */}
                        <Box sx={globalsStyleSx.inputContainer}>
                            <Typography component="p">Врач</Typography>
                            <CustomSelect
                                value={doctor}
                                onChange={setDoctor}
                                options={doctors}
                                placeholder="Выберите врача"
                            />
                        </Box>

                        {/* Поиск клиента */}
                        <Box sx={globalsStyleSx.inputContainer}>
                            <Typography component="p">Пациент</Typography>
                            <CustomAutocomplete
                                value={client}
                                onChange={setClient}
                                options={clients}
                                placeholder="Введите имя пациента"
                            />
                        </Box>

                        {/* Выбор даты */}
                        <Box sx={globalsStyleSx.inputContainer}>
                            <Typography component="p">Дата записи</Typography>
                            <InputForm
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                fullWidth
                            />
                        </Box>

                        {/* Выбор времени */}
                        {date && (
                            <Box sx={globalsStyleSx.inputContainer}>
                                <Typography component="p">Время записи</Typography>
                                <CustomSelect
                                    value={time}
                                    onChange={setTime}
                                    options={availableTimes.map((value) => ({
                                        id: value.id,
                                        name: value.time,
                                        disabled: !value.isAvailable,
                                    }))}
                                    placeholder="Выберите время"
                                />
                            </Box>
                        )}

                        <CustomButton type="submit" variant="contained">
                            Записать
                        </CustomButton>
                    </Grid>
                </Grid>
            </form>

            {/* Уведомление об успешной отправке */}
            <CustomSnackbar
                open={snackbarOpen}
                onClose={handleCloseSnackbar}
                message="Пользователь записан!"
            />
        </Box>
    );
};