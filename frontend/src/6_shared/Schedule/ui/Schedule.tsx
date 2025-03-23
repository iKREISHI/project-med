import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { scheduleSx } from './scheduleSx';

interface ScheduleEntry {
    time: string;
    event: string;
    type: 'patient' | 'other';
}

interface DaySchedule {
    day: string; // Формат: '2025-03-03'
    schedule: ScheduleEntry[];
}

interface ScheduleProps {
    schedule: DaySchedule[];
}

export const Schedule: React.FC<ScheduleProps> = ({ schedule }) => {
    const navigate = useNavigate();

    const handleCellClick = (event: string, type: string) => {
        if (event && type == "patient") {
            console.log(event);
            navigate(`/admission`, { state: { patientName: event } });
        }
    };

    // Функция для форматирования даты
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    // Собираем все уникальные временные метки из всех дней
    const allTimes = new Set<string>();
    schedule.forEach((daySchedule) => {
        daySchedule.schedule.forEach((entry) => {
            allTimes.add(entry.time);
        });
    });

    // Преобразуем Set в массив и сортируем его
    const sortedTimes = Array.from(allTimes).sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a}:00`).getTime();
        const timeB = new Date(`1970-01-01T${b}:00`).getTime();
        return timeA - timeB;
    });

    // Группируем временные метки по часам
    const groupedTimes: { [key: string]: string[] } = {};
    sortedTimes.forEach((time) => {
        const hour = time.split(':')[0];
        if (!groupedTimes[hour]) {
            groupedTimes[hour] = [];
        }
        groupedTimes[hour].push(time);
    });

    // Сортируем ключи объекта groupedTimes по возрастанию
    const sortedHours = Object.keys(groupedTimes).sort((a, b) => parseInt(a) - parseInt(b));

    return (
        <TableContainer component={Box} sx={scheduleSx.getTableContainer}>
            <Table sx={scheduleSx.getTable}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{
                            ...scheduleSx.getHeaderCell, borderLeft: 'none', borderBottom: 'none', borderTop: 'none'}}>Часы</TableCell>
                        <TableCell sx={{...scheduleSx.getHeaderCell, borderTop: 'none'}}>Минуты</TableCell>
                        {schedule.map((daySchedule) => (
                            <TableCell key={daySchedule.day} sx={{ ...scheduleSx.getHeaderCell, borderRight: 'none', borderTop: 'none'}}>
                                {formatDate(daySchedule.day)}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedHours.map((hour) => (
                        <React.Fragment key={hour}>
                            {groupedTimes[hour].map((timeSlot, index) => (
                                <TableRow key={timeSlot}>
                                    {index === 0 && (
                                        <TableCell
                                            rowSpan={groupedTimes[hour].length}
                                            sx={{ ...scheduleSx.getHeaderCell, borderLeft: 'none', borderBottom: 'none' }}
                                        >
                                            {hour}
                                        </TableCell>
                                    )}
                                    <TableCell  sx={{ ...scheduleSx.getHeaderCell, borderBottom: 'none' }}>
                                        {timeSlot}
                                    </TableCell>
                                    {schedule.map((daySchedule) => {
                                        const eventEntry = daySchedule.schedule.find((entry) => entry.time === timeSlot);
                                        const event = eventEntry ? eventEntry.event : '';
                                        const type = eventEntry ? eventEntry.type : 'other';
                                        return (
                                            <TableCell
                                                key={daySchedule.day}
                                                onClick={() => handleCellClick(event, type)}
                                                sx={scheduleSx.getEventCell(type, event)}
                                            >
                                                {event || ''}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};