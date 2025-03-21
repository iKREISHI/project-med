import React, { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, IconButton, Typography, Toolbar, AppBar, Switch, useTheme } from '@mui/material';
import { headerSx } from './headerSx';
import { AvatarPerson } from '../../../5_entities/Avatar';
import { globalsStyle } from '../../../6_shared/styles/globalsStyle';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeContext } from '../../../6_shared/Header/ThemeContext';

interface User {
  name: string;
  surname: string;
}

interface HeaderProps {
  handleDrawerToggle: () => void;
  user: User;
  title: string;
  subtitle: string;
  users?: User[];
}

const Header: React.FC<HeaderProps> = ({ handleDrawerToggle, title, subtitle, user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { toggleTheme, mode } = useThemeContext();
  const theme = useTheme();

  // Загрузка скриптов для версии для слабовидящих
  useEffect(() => {
    const loadScript = (src: string, id: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.id = id;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Ошибка загрузки скрипта: ${src}`));
        document.body.appendChild(script);
      });
    };

    const loadScripts = async () => {
      try {
        await loadScript('https://lidrekon.ru/slep/js/jquery.js', 'jquery-script');
        await loadScript('https://lidrekon.ru/slep/js/uhpv-hover-full.min.js', 'uhpv-script');
      } catch (error) {
        console.error('Ошибка при загрузке скриптов:', error);
      }
    };
    loadScripts();
  }, []);

  // Отслеживание события прокрутки страницы (для изменения стилей шапки страницы)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const appBarStyles = {
    ...headerSx.appBar,
    width: { sm: `calc(100% - ${globalsStyle.widthDrawer})` },
    backgroundColor: isScrolled ? theme.palette.background.default : 'transparent',
    boxShadow: isScrolled ? '0 0 3px rgba(0, 0, 0, 0.1)' : '0',
  };

  return (
    <AppBar position="fixed" elevation={0} sx={appBarStyles}>
      <Toolbar sx={headerSx.toolbar}>
        <IconButton
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={headerSx.iconButton}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={headerSx.container}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              noWrap
              component="h1"
              sx={{
                fontSize: {
                  sm: theme.typography.h4.fontSize,
                  xs: theme.typography.body1.fontSize,
                },
                color: theme.palette.text.primary,
              }}
            >
              {title}
            </Typography>
            <Typography
              noWrap
              component="p"
              sx={{
                fontSize: theme.typography.body2.fontSize,
                display: { xs: 'none', sm: 'flex' },
                color: theme.palette.text.primary,
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          <Box sx={headerSx.userInfoBox}>
            <Box sx={headerSx.userTextContainer}>
              <Switch checked={mode === 'dark'} onChange={toggleTheme} color="primary" />
              {mode === 'dark' ? (
                <LightModeIcon sx={{ color: theme.palette.primary.main }} /> // Солнышко
              ) : (
                <ModeNightIcon sx={{ color: theme.palette.primary.main }} /> // Луна 
              )}
            </Box>
            {/* Кнопка для слабовидящих */}
            <img
              id="specialButton"
              src="https://lidrekon.ru/images/special.png"
              alt="ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ"
              title="ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ"
              style={{
                cursor: 'pointer',
                filter: theme.palette.mode === 'dark' ? 'invert(100%)' : 'none',
              }}
            />
            <AvatarPerson name={user.name} />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header