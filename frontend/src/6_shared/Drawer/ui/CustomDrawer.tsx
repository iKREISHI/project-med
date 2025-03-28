import React, { JSX, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ListItemText, ListItemButton, ListItem, List, Toolbar, Drawer, Box, IconButton, Typography, useTheme, SxProps, Theme, Divider, ListItemIcon, useMediaQuery, } from '@mui/material';
import { customDrawerSx } from './customDrawerSx';
import CloseIcon from '@mui/icons-material/Close';
import { globalsStyle } from '../../styles/globalsStyle';
import logo from './logo.png';
import { InputSearch } from '../../Input';
import MicIcon from '@mui/icons-material/Mic';

interface ListItem {
    name: string;
    path: string;
    icon?: JSX.Element;
}

interface CustomDrawerProps {
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
    handleSearch?: () => void;
    listItems: ListItem[];
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ mobileOpen, handleDrawerToggle, listItems, handleSearch }) => {
    const location = useLocation();
    const theme = useTheme();
    const navigate = useNavigate()
    const [search, setSearch] = useState('');
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isDarkText = !(theme.palette.mode === "dark");
    const [isListening, setIsListening] = useState(false);
    const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);

    useEffect(() => {
        // Проверяем поддержку API распознавания речи
        const recognitionSupport = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        setHasSpeechRecognition(recognitionSupport && isMobile);
    }, [isMobile]);

    const handleVoiceInput = () => {
        if (!hasSpeechRecognition) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'ru-RU';
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearch(transcript);
            setIsListening(false);
            if (handleSearch) handleSearch();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const drawer = (
        <Box sx={customDrawerSx.sideContainer}>
            <Box sx={customDrawerSx.linkContainer}>
                <Toolbar sx={customDrawerSx.toolbar}>
                    <Box sx={customDrawerSx.topContainer}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                cursor: 'pointer',
                            }}
                            onClick={(e) => navigate("/")}
                        >
                            <img
                                src={logo}
                                alt="Логотип"
                                style={{ width: '44px' }}
                            />
                            <Typography component="p" sx={{ fontSize: theme.typography.h2, fontWeight: '700' }}>
                                Медvед код
                            </Typography>
                        </Box>
                        <IconButton disableRipple onClick={handleDrawerToggle} sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        {isMobile && (
                            <Box sx={{ flexGrow: 1, mt: 2, mb: 1, position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                                <InputSearch
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    fullWidth
                                    placeholder="Введите запрос"
                                    onSearch={handleSearch}
                                    isDarkText={isDarkText}
                                />
                                {hasSpeechRecognition && (
                                    <IconButton
                                        onClick={handleVoiceInput}
                                        sx={{
                                            right: 8,
                                            top: '50%',
                                            color: isListening ? theme.palette.primary.main : theme.palette.grey[500],
                                            transform: 'translateX(20%)',
                                        }}
                                        disableRipple
                                    >
                                        <MicIcon />
                                    </IconButton>
                                )}
                            </Box>
                        )}
                    </Box>
                </Toolbar>
                <List sx={{ mt: { md: 6 } }}>
                    {listItems.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                disableRipple
                                component={Link}
                                to={item.path}
                                sx={{
                                    ...customDrawerSx.listButton,
                                    ...customDrawerSx.listButtonHover,
                                    ...(`/${location.pathname.split('/')[1]}` === item.path && {
                                        backgroundColor: theme.palette.grey[300],
                                    }),
                                } as SxProps<Theme>}
                            >
                                {item.icon && <ListItemIcon sx={{ color: 'inherit', width: '18.76px' }}>{item.icon}</ListItemIcon>}
                                <ListItemText
                                    primary={
                                        <Typography variant="h6">
                                            {item.name}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );

    return (
        <>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: globalsStyle.widthDrawer,
                        border: 'none',
                        ...customDrawerSx.drawerPaper,
                    },
                } as SxProps<Theme>}
            >
                {drawer}
            </Drawer>

            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    width: globalsStyle.widthDrawer,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: globalsStyle.widthDrawer,
                        boxSizing: 'border-box',
                        ...customDrawerSx.drawerPaper,
                    },
                } as SxProps<Theme>}
                open
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default CustomDrawer;