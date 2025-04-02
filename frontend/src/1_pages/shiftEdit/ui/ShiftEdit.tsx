// @ts-nocheck
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Divider, useMediaQuery } from '@mui/material';
import { CustomButton } from "@6_shared/Button";
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { globalsStyleSx } from '@6_shared/styles/globalsStyleSx';
import Grid from '@mui/material/Grid2';
import { PatientMenu } from '@6_shared/PatientMenu';
import { getCurrentUser } from '@5_entities/user';
import { getEmployee } from '@5_entities/emloyee/api/getEmployee';

const menuItems = [
    { name: "Госпитализация", path: "hospitalization" },
    { name: "Состояния пациентов", path: "conditions" },
];

interface Shift {
    id?: number;
    doctor: string;
    doctor_name: string;
    start_time: string;
    end_time: string;
    shift_str: string;
    comment?: string;
}

export const ShiftEdit: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 600px)");

    const [shiftData, setShiftData] = useState<Shift>({
        doctor: '',
        doctor_name: '',
        start_time: '',
        end_time: '',
        shift_str: '',
        comment: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getCurrentUser();
                const data = await getEmployee(user.id);
                console.log(user);

                const fullName = `${data.last_name} ${data.first_name} ${data.patronymic || ''}`.trim();

                const mockShift: Shift = {
                    id: 1,
                    doctor: String(user.id),
                    doctor_name: fullName,
                    start_time: '2023-05-15T08:00',
                    end_time: '2023-05-15T20:00',
                    shift_str: `Смена ${fullName}`,
                    comment: 'Обычная смена'
                };

                setShiftData(mockShift);
            } catch (error) {
                console.error("Ошибка получения пользователя:", error);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Отправка данных смены:", shiftData);
    };

    return (
        <Box sx={{ ...globalsStyleSx.container, p: 0, overflow: 'hidden' }}>
            <Box sx={{ flex: 1, p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={() => navigate('/doctor-shift')} sx={{ mr: 2 }} disableRipple>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h2">{shiftData.shift_str}</Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid xs={12}>
                            <Typography>Комментарий: {shiftData.comment}</Typography>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                        <CustomButton type="submit" variant="contained">
                            Сохранить изменения
                        </CustomButton>
                    </Box>
                </form>
            </Box>

            <Divider />

            <Box sx={{ overflow: 'hidden' }}>
                <Box sx={{ position: 'relative' }}>
                    {isMobile && (
                        <Box sx={{ width: '100%', zIndex: 1 }}>
                            <PatientMenu menuItems={menuItems} />
                        </Box>
                    )}
                    <Box sx={globalsStyleSx.flexContainerMenu}>
                        {!isMobile && <PatientMenu menuItems={menuItems} />}
                        <Box sx={{
                            flex: 1,
                            mt: isMobile ? 6 : 0,
                            overflow: 'auto',
                            p: 1
                        }}>
                            <Outlet />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
