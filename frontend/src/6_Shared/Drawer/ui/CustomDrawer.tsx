import React, { JSX, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ListItemText, ListItemButton, ListItem, List, Toolbar, Drawer, Box, IconButton, Typography, useTheme, SxProps, Theme, Divider, ListItemIcon, } from '@mui/material';
import { customDrawerSx } from './customDrawerSx';
import { InputSearch } from '../../Input';
import CloseIcon from '@mui/icons-material/Close';
import { globalsStyle } from '../../styles/globalsStyle';

interface ListItem {
    name: string;
    path: string;
    icon?: JSX.Element;
}

interface CustomDrawerProps {
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
    listItems: ListItem[];
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ mobileOpen, handleDrawerToggle, listItems }) => {
    const [search, setSearch] = useState('');
    const location = useLocation();
    const theme = useTheme();

    const handleSearch = () => {
        console.log(search);
    };

    const drawer = (
        <Box sx={customDrawerSx.sideContainer}>
            <Box sx={customDrawerSx.linkContainer}>
                <Toolbar sx={customDrawerSx.toolbar}>
                    <Box sx={customDrawerSx.topContainer}>
                        <Box>
                            <Typography component="p" sx={{ fontSize: theme.typography.body1.fontSize, color: theme.palette.common.white }}>медvед код</Typography>
                        </Box>
                        <IconButton onClick={handleDrawerToggle} sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <CloseIcon sx={{ color: theme.palette.common.white }} />
                        </IconButton>
                    </Box>
                    <InputSearch
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth
                        placeholder="Поиск"
                        onSearch={handleSearch}
                    />
                </Toolbar>
                {/* <Typography component="p" sx={{ fontSize: theme.typography.body2.fontSize, color: theme.palette.common.white, p: 1 }}>
                    Меню
                </Typography> */}
                <Divider sx={{ backgroundColor: theme.palette.common.white, mt: 1}} />
                <List>
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
                                {/* Отображаем иконку, если она есть */}
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