// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface User {
  name: string;
  surname: string;
}

interface HeaderProps {
  handleDrawerToggle: () => void;
  user: User;
  users?: User[];
}

const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  const recognition = isSupported 
    ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    : null;

  if (recognition) {
    recognition.continuous = true;
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(prev => prev + ' ' + transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
  }

  const startListening = () => {
    if (!isSupported) return;
    setTranscript('');
    setIsListening(true);
    recognition?.start();
  };

  const stopListening = () => {
    if (!isSupported) return;
    setIsListening(false);
    recognition?.stop();
  };

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    isSupported
  };
};

const Header: React.FC<HeaderProps> = ({ handleDrawerToggle, user }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { toggleTheme, mode } = useThemeContext();
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<{name: string, path: string}[]>([]);
  const isDarkText = !(theme.palette.mode === "dark");

  // Список доступных пунктов меню для поиска
  const menuItems = [
    { name: 'Главная', path: '' },
    { name: 'Чат', path: '/chat' },
    { name: 'Регистрация', path: '/registry' },
    { name: 'Прием', path: '/admission' },
  ];

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    isSupported: isSpeechSupported
  } = useSpeechToText();

  useEffect(() => {
    if (transcript) {
      setSearch(transcript);
    }
  }, [transcript]);

  // Обновление подсказок при изменении поискового запроса
  useEffect(() => {
    if (search.trim()) {
      const matchedItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setSuggestions(matchedItems);
    } else {
      setSuggestions([]);
    }
  }, [search]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Обработчик поиска
  const handleSearch = () => {
    if (!search.trim()) return;

    const foundItem = menuItems.find(item =>
      item.name.toLowerCase() === search.toLowerCase()
    );

    if (foundItem) {
      navigate(foundItem.path);
      setSearch('');
      setSuggestions([]);
    } else if (suggestions.length > 0) {
      navigate(suggestions[0].path);
      setSearch('');
      setSuggestions([]);
    }
  };

  // Обработчик нажатия Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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

  const handleVoiceInputFallback = () => {
    const voiceInput = prompt('Введите ваш запрос (голосовой ввод не поддерживается в вашем браузере):');
    if (voiceInput) {
      setSearch(voiceInput);
    }
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
            position: 'relative'
          }}>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                width: { lg: '600px', sm: '100%' },
                margin: '0 auto',
                alignItems: 'center',
                gap: 1,
                position: 'relative'
              }}
            >
              <InputSearch
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                fullWidth
                placeholder={isListening ? "Говорите сейчас..." : "Введите запрос"}
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
                    color: isListening
                      ? theme.palette.primary.main
                      : isDarkText
                        ? theme.palette.grey[900]
                        : theme.palette.common.white,
                    border: `1px solid ${isListening
                      ? theme.palette.primary.main
                      : theme.palette.grey[400]}`,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '50%',
                    
                    animation: isListening ? 'pulse 1.5s infinite' : 'none',
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