import { FC, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, } from "@mui/material";


export const VisitHistory: FC = () => {

    const visits = [
        { date: "2025-03-16", purpose: "Консультация", diagnosis: "ОРВИ" },
        { date: "2025-03-16", purpose: "Консультация", diagnosis: "ОРВИ" },
        { date: "2025-03-16", purpose: "Консультация", diagnosis: "ОРВИ" },
        { date: "2025-03-16", purpose: "Консультация", diagnosis: "ОРВИ" },
        { date: "2025-03-16", purpose: "Консультация", diagnosis: "ОРВИ" },
        { date: "2025-03-16", purpose: "Консультация", diagnosis: "ОРВИ" },

    ];

    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const paginatedVisits = visits.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    const handlePageChange = (e: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    return (
        <Box sx={{p: 1}}>
            <Typography variant="h1" gutterBottom>
                История посещений
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Дата</TableCell>
                            <TableCell>Цель посещения</TableCell>
                            <TableCell>Диагноз</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedVisits.map((visit, index) => (
                            <TableRow key={index}>
                                <TableCell>{visit.date}</TableCell>
                                <TableCell>{visit.purpose}</TableCell>
                                <TableCell>{visit.diagnosis}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Пагинация */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                    count={Math.ceil(visits.length / rowsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                />
            </Box>
        </Box>
    );
};