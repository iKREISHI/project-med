import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { InputForm } from "@6_shared/Input";
import { CustomButton } from "@6_shared/Button";
import { CustomSnackbar } from "@6_shared/Snackbar";
import { CustomSelect } from "@6_shared/Select";
import { CustomAutocomplete } from "@6_shared/Autocomplete";
import Grid from '@mui/material/Grid2';


// Форма приема пациента
interface AdmissionInfoFormProps {
    patientName?: string;
}

export const AdmissionInfoForm: React.FC<AdmissionInfoFormProps> = ({ patientName }) => {
    const [doctor, setDoctor] = useState("");
    const [client, setClient] = useState("");
    const [date, setDate] = useState("");
    const [medcard, setMedcard] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // const doctors = [
    //     { id: 1, name: "Иванов" },
    //     { id: 2, name: "Петров" },
    // ];

    const clients = [
        { id: 1, name: "Иван Иванов" },
        { id: 2, name: "Петр Петров" },
        { id: 3, name: "Анна Аннова" },
    ];

    const medcards = [
        { id: 1, number: "Карта 1" },
        { id: 2, number: "Карта 2" },
    ];

    // Сегодняшняя дата
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setDate(today);
    }, []);
    // Устанавливаем дефолтное значение 
    useEffect(() => {
        if (patientName) {
            setClient(patientName);
        } else {
            setClient(client);
        }
    }, [patientName, clients]);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSnackbarOpen(true); // Показываем уведомление об успешной отправке
    };

    // Скрываем уведомление
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                {/* Выбор врача */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 11, lg: 7 }}>
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                type="text"
                                value={doctor}
                                onChange={(e) => setDoctor(e.target.value)}
                                disabled
                                fullWidth
                                placeholder="Иванов Иван"
                                label="Врач"
                            />
                        </Box>

                        {/* Выбор даты */}
                        <Box sx={{ mt: 2 }}>
                            <InputForm
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                fullWidth
                                label="Дата"
                            />
                        </Box>

                        {/* Поиск клиента */}
                        <Box sx={{ mt: 2 }}>
                            <CustomAutocomplete
                                value={client}
                                onChange={setClient}
                                options={clients}
                                placeholder="Введите имя клиента"
                                disabled={patientName ? true : false}
                                label="Клиент"
                                fullWidth
                                required
                            />
                        </Box>

                        {/* Выбор медицинской карты */}
                        <Box sx={{ mt: 2 }}>
                            <CustomSelect
                                value={medcard}
                                onChange={setMedcard}
                                options={medcards.map((card) => ({
                                    id: card.id,
                                    name: card.number,
                                }))}
                                placeholder={
                                    client ? "Выберите медицинскую карту" : "Сначала выберите клиента"
                                }
                                disabled={!client}
                                label="Мед. карта"
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <CustomButton type="submit" variant="contained">
                                Провести
                            </CustomButton>
                        </Box>
                    </Grid>
                </Grid>
            </form>

            {/* Уведомление об успешной отправке */}
            <CustomSnackbar
                open={snackbarOpen}
                onClose={handleCloseSnackbar}
                message="Данные успешно сохранены!"
            />
        </Box>
    );
};