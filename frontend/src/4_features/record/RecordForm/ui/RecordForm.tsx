// @ts-nocheck
// @ts-nocheck
import { FC, useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { InputForm } from "../../../../6_shared/Input";
import { CustomButton } from "../../../../6_shared/Button";
import { CustomSnackbar } from "../../../../6_shared/Snackbar";
import { CustomAutocomplete } from "../../../../6_shared/Autocomplete";
import Grid from '@mui/material/Grid2';
import { getAllEmployee } from "@5_entities/emloyee/api/getAllEmployee";
import { ReceptionTime } from "@5_entities/receptionTime";
import { addReceptionTime } from "@5_entities/receptionTime/api/addREceptionTime";
import { getAllPatients, Patient } from "@5_entities/patient";
import { addBookingAppointment } from "@5_entities/bookingAppointments/api/addBokingAppointment";
import { BookingAppointment } from "@5_entities/bookingAppointments";

interface Doctor {
  id: number;
  name: string;
  position: number;
  appointment_duration: string;
}

export const RecordForm: FC = () => {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const employee = await getAllEmployee({page: 1, page_size: 100});
                const filteredDoctors = employee.results
                    .filter(doc => doc.position === 1)
                    .map(doc => ({ 
                        id: doc.id, 
                        name: `${doc.last_name} ${doc.first_name} ${doc.patronymic || ''}`.trim(),
                        position: doc.position,
                        appointment_duration: doc.appointment_duration || "00:30:00"
                    }));
                setDoctors(filteredDoctors);
            } catch (error) {
                console.error('Ошибка при получении докторов: ', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchPatients = async () => {
            setLoading(true);
            try {
                const patientData = await getAllPatients({page:1, page_size:100});
                setPatients(patientData.results.map(doc => ({
                    id: doc.id,
                    name: `${doc.last_name} ${doc.first_name} ${doc.patronymic || ''}`.trim(),
                })));
            } catch (error) {
                console.error(error);
            }
        }
        fetchPatients();
        fetchDoctors();
    }, []);

    const formatDatetime = (date: string, time: string): string => {
        if (!date || !time) return "";
        const datetime = new Date(`${date}T${time}:00.000Z`);
        return datetime.toISOString();
    };

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formattedDatetime = formatDatetime(date, time);
        if (!formattedDatetime || !selectedDoctor || !selectedPatient) return;
        addBookingAppointment({
            vizit_datetime: formattedDatetime,
            doctor: selectedDoctor.id,
            patient: selectedPatient.id,
            status:"confirmation"
        } as BookingAppointment);
        setSnackbarOpen(true);
    }, [date, time, selectedDoctor, selectedPatient]);

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
                                }}
                                options={doctors.map(d => d.name)}
                                placeholder="Выберите врача"
                                label="Врач"
                                required
                            />
                            <CustomAutocomplete
                                loading={loading}
                                value={selectedPatient?.name || ''}
                                onChange={(value) => {
                                    const selectedPat = patients.find(d => d.name === value);
                                    setSelectedPatient(selectedPat || null);
                                }}
                                options={patients.map(d => d.name)}
                                placeholder="Выберите пациента"
                                label="Пациент"
                                required
                            />
                            <InputForm
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <InputForm
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </Box>
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
                onClose={() => setSnackbarOpen(false)}
                message="Пользователь записан!"
                severity="success"
                autoHideDuration={3000}
            />
        </Box>
    );
};
