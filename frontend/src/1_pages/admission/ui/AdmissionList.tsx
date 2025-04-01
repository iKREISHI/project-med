import * as React from 'react';
import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Paper, useTheme, useMediaQuery, Theme, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { ruRU } from '@mui/x-data-grid/locales';
import { useNavigate } from 'react-router-dom';
import { InputSearch } from "@6_shared/Input";
import { CustomButton } from "@6_shared/Button";

export const AdmissionList: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const isDarkText = !(theme.palette.mode === "dark");


    return(
        <Box sx={{
            width: '100%',
            boxSizing: 'border-box'
        }}>
            <CustomButton
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/patients/create")}
                >
                    Провести прием
                </CustomButton>
        </Box>
    )
}