import React, { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, IconButton, Toolbar, AppBar, Switch, useTheme } from '@mui/material';
import { headerSx } from './headerSx';
import { AvatarPerson } from '@5_entities/Avatar';
import { globalsStyle } from '@6_shared/styles/globalsStyle';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeContext } from '@6_shared/Header/ThemeContext';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { InputSearch } from '../../Input';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface User {
  name: string;
  surname: string;
}

interface HeaderProps {
  handleDrawerToggle: () => void;
  handleSearch: () => void;
  user: User;
  users?: User[];
}

const Header: React.FC<HeaderProps> = ({ handleDrawerToggle, user, handleSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { toggleTheme, mode } = useThemeContext();
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const isDarkText = !(theme.palette.mode === "dark");

  // Настройка голосового ввода
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Обновление текста при получении результатов голосового ввода
  useEffect(() => {
    if (transcript) {
      setSearch(transcript);
    }
  }, [transcript]);

  // Проверка поддержки браузером
  const isSpeechSupported = browserSupportsSpeechRecognition;

  // Управление состоянием микрофона
  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        language: 'ru-RU',
        continuous: true
      });
    }
  };

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

  // Отслеживание события прокрутки страницы
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
    backgroundColor: isScrolled ? theme.palette.background.paper : 'transparent',
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
          disableRipple
        >
          <MenuIcon />
        </IconButton>
        <Box sx={headerSx.container}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
          }}>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                width: { lg: '600px', sm: '100%' },
                margin: '0 auto',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <InputSearch
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                placeholder={listening ? "Говорите сейчас..." : "Введите запрос"}
                onSearch={handleSearch}
                isDarkText={isDarkText}
                bgcolorFlag={true}
              />
              {/* микрофон */}
              {isSpeechSupported && (
                <IconButton
                  aria-label="микрофон"
                  onClick={toggleListening}
                  disableRipple
                  sx={{
                    color: listening
                      ? theme.palette.primary.main
                      : isDarkText
                        ? theme.palette.grey[900]
                        : theme.palette.common.white,
                    border: `1px solid ${listening
                      ? theme.palette.primary.main
                      : theme.palette.grey[400]}`,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '50%',
                    
                    animation: listening ? 'pulse 1.5s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.1)' },
                      '100%': { transform: 'scale(1)' }
                    }
                  }}
                >
                  <MicNoneOutlinedIcon sx={{ fontSize: '26px' }} />
                </IconButton>
              )}
            </Box>
          </Box>

          <Box sx={headerSx.userInfoBox}>
            <Box sx={headerSx.userTextContainer}>
              <Switch checked={mode === 'dark'} onChange={toggleTheme} color="secondary" disableRipple />
              {mode === 'dark' ? (
                <LightModeIcon sx={{ color: theme.palette.grey[900] }} />
              ) : (
                <ModeNightIcon sx={{ color: theme.palette.grey[900] }} />
              )}
            </Box>
            {/* Кнопка для слабовидящих */}
            <IconButton
              id="specialButton"
              aria-label="ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ"
              title="ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ"
              disableRipple
            >
              <VisibilityOutlinedIcon
                sx={{
                  color: theme.palette.grey[900],
                  fontSize: '1.5em',
                  p: 0
                }}
              />
            </IconButton>
            <AvatarPerson name={user.name} />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;