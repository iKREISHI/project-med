import React, { JSX, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ListItemText, ListItemButton, ListItem, List, Toolbar, Drawer, Box, IconButton, Typography, useTheme, SxProps, Theme, Divider, ListItemIcon, useMediaQuery, } from '@mui/material';
import { customDrawerSx } from './customDrawerSx';
import CloseIcon from '@mui/icons-material/Close';
import { globalsStyle } from '../../styles/globalsStyle';
import logo from './logo.png';
import { InputSearch } from '../../Input';


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
                            {/* Логотип */}
                            <img
                                src={logo}
                                alt="Логотип"
                                style={{ width: '60px' }}
                            />
                            {/* Текст */}
                            <Typography component="p" sx={{ fontSize: '1rem', color: 'common.white' }}>
                                медvед код
                            </Typography>
                        </Box>
                        <IconButton disableRipple onClick={handleDrawerToggle} sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <CloseIcon sx={{ color: theme.palette.common.white }} />
                        </IconButton>
                        
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        {isMobile && (
                            <Box sx={{ flexGrow: 1, mt: 1, mb: 2}}>
                                <InputSearch
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    fullWidth
                                    placeholder="Введите запрос"
                                    onSearch={handleSearch}
                                    borderColor="#fff"
                                    isDarkText={false}
                                    shadowColor="#fff"
                                />
                            </Box>
                        )}
                    </Box>

                </Toolbar>
                {/* <Typography component="p" sx={{ fontSize: theme.typography.body2.fontSize, color: theme.palette.common.white, p: 1 }}>
                    Меню
                </Typography> */}
                {/* <Divider sx={{ backgroundColor: theme.palette.common.white, mt: 1}} /> */}
                <List sx={{ mt: { md: 2 } }}>
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
                                        backgroundColor: globalsStyle.colors.blueDark,
                                        color: theme.palette.common.white,
                                    }),
                                } as SxProps<Theme>}
                            >
                                {item.icon && <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>}
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );

    return (
        <>
            {/* Мобильная версия */}
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

            {/* Десктопная версия */}
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