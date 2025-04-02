// @ts-nocheck
import { FC, useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { InputForm } from "../../../../6_shared/Input";
import { CustomButton } from "../../../../6_shared/Button";
import { CustomSnackbar } from "../../../../6_shared/Snackbar";
import { CustomSelect } from "../../../../6_shared/Select";
import { CustomAutocomplete } from "../../../../6_shared/Autocomplete";
import Grid from '@mui/material/Grid2';
import { getAllEmployee } from "@5_entities/emloyee/api/getAllEmployee";
import { ReceptionTime } from "@5_entities/receptionTime";
import { addReceptionTime } from "@5_entities/receptionTime/api/addREceptionTime";

interface Doctor {
  id: number;
  name: string;
  position: number;
  appointment_duration: string; // Формат "HH:MM:SS"
}

interface Client {
  id: number;
  name: string;
}

interface AvailableTime {
  id: number;
  time: string;
  isAvailable: boolean;
}

export const RecordForm: FC = () => {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [clients] = useState<Client[]>([
        { id: 1, name: "Иван Иванов" },
        { id: 2, name: "Петр Петров" },
    ]);
    const [availableTimes] = useState<AvailableTime[]>([
        { id: 1, time: "09:00", isAvailable: true },
        { id: 2, time: "10:00", isAvailable: false },
        { id: 3, time: "11:00", isAvailable: true },
        { id: 4, time: "12:00", isAvailable: true },
        { id: 5, time: "13:00", isAvailable: false },
    ]);
    const [receptionTime, setReceptionTime] = useState<Partial<ReceptionTime>>();
    const [loading, setLoading] = useState(false);

    // Преобразуем "HH:MM:SS" в минуты
    const durationToMinutes = (duration: string): number => {
        if (!duration) return 30; // Fallback
        
        const [hours, minutes] = duration.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Форматируем минуты в "HH:MM"
    const formatMinutes = (totalMinutes: number): string => {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    };

    const calculateEndTime = useCallback((startTime: string, duration: string) => {
        if (!startTime) return "";
        
        const durationMinutes = durationToMinutes(duration);
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + durationMinutes;
        
        return formatMinutes(totalMinutes % (24 * 60)); // Обрабатываем переход через полночь
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const employee = await getAllEmployee({page: 1, page_size: 100});
                const filteredDoctors = employee.results
                    .filter(doc => doc.position === 9)
                    .map(doc => ({ 
                        id: doc.id, 
                        name: `${doc.last_name} ${doc.first_name} ${doc.middle_name || ''}`.trim(),
                        position: doc.position,
                        appointment_duration: doc.appointment_duration || "00:30:00" // Формат HH:MM:SS
                    }));
                setDoctors(filteredDoctors);
            } catch (error) {
                console.error('Ошибка при получении докторов: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    useEffect(() => {
        if (time && selectedDoctor) {
            const calculatedEndTime = calculateEndTime(time, selectedDoctor.appointment_duration);
            setEndTime(calculatedEndTime);
            handleChange('end_time')(calculatedEndTime);
        }
    }, [time, selectedDoctor, calculateEndTime]);

    const handleChange = useCallback((field: keyof ReceptionTime) => (value: any) => {
        setReceptionTime(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addReceptionTime(receptionTime as ReceptionTime);
        setSnackbarOpen(true);
    }, [receptionTime, date, time, endTime, selectedDoctor]);

    const handleCloseSnackbar = useCallback(() => {
        setSnackbarOpen(false);
    }, []);

    const getDurationText = (duration: string): string => {
        const mins = durationToMinutes(duration);
        return mins >= 60 
            ? `${Math.floor(mins / 60)} ч ${mins % 60} мин` 
            : `${mins} мин`;
    };

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 11, lg: 7 }}>
                        <Box sx={{ mt: 2 }}>
                            <CustomAutocomplete
                                loading={loading}
                                value={selectedDoctor?.name || ''}
                                onChange={(value) => {
                                    const selectedDoc = doctors.find(d => d.name === value);
                                    setSelectedDoctor(selectedDoc || null);
                                    handleChange('doctor')(selectedDoc?.id);
                                }}
                                options={doctors.map(d => d.name)}
                                placeholder="Выберите врача"
                                label="Врач"
                                required
                            />
                        </Box>
                        
                        <Box sx={{ mt: 2 }}>
                        <InputForm
                            type="date"
                            value={date}
                            onChange={(e) => {
                            const selectedDate = e.target.value; // Уже в формате YYYY-MM-DD
                            setDate(selectedDate);
                            handleChange('reception_day')(selectedDate);
                            }}
                            required
                            fullWidth
                            label="Дата приёма"
                            inputProps={{
                            pattern: "\\d{4}-\\d{2}-\\d{2}", // Формат YYYY-MM-DD
                            title: "Укажите дату приёма (YYYY-MM-DD)"
                            }}
                        />
                        </Box>

                        {date && (
                            <Box sx={{ mt: 2 }}>
                                <CustomSelect
                                    value={time}
                                    onChange={(value) => {
                                        setTime(value);
                                        handleChange('start_time')(value);
                                    }}
                                    options={availableTimes.map((value) => ({
                                        id: value.id,
                                        name: value.time,
                                        disabled: !value.isAvailable,
                                    }))}
                                    label="Выберите время начала"
                                    required
                                    fullWidth
                                    placeholder="Выберите время"
                                />
                            </Box>
                        )}
                        
                        {time && selectedDoctor && (
                            <Box sx={{ mt: 2 }}>
                                <InputForm
                                    type="text"
                                    value={endTime ? `${time} - ${endTime}` : "Выберите время"}
                                    fullWidth
                                    label="Время приема"
                                    disabled
                                />
                                <Box sx={{ mt: 1, fontSize: '0.8rem', color: 'text.secondary' }}>
                                    Длительность: {getDurationText(selectedDoctor.appointment_duration)}
                                </Box>
                            </Box>
                        )}

                        <Box sx={{ mt: 4 }}>
                            <CustomButton 
                                type="submit" 
                                variant="contained"
                                disabled={loading || !time || !date || !selectedDoctor}
                            >
                                {loading ? 'Загрузка...' : 'Записать'}
                            </CustomButton>
                        </Box>
                    </Grid>
                </Grid>
            </form>

            <CustomSnackbar
                open={snackbarOpen}
                onClose={handleCloseSnackbar}
                message="Пользователь записан!"
                severity="success"
                autoHideDuration={3000}
            />
        </Box>
    );
};