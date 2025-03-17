import { FC } from "react";
import { Box, List, ListItem, ListItemButton, ListItemText, useTheme, SxProps, Theme, Accordion, AccordionSummary, AccordionDetails, Typography, useMediaQuery, } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { globalsStyle } from "../../styles/globalsStyle.ts";
import { patientMenuSx } from "./patientMenuSx.ts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


// Отображение меню на странице пациента
export const PatientMenu: FC = () => {
  
  // Пункты меню
  const menuItems = [
    { name: "Контактная информация", path: "info" },
    { name: "Паспортные данные", path: "passport" },
    { name: "Медицинские данные", path: "medical-data" },
    { name: "Адреса", path: "addresses" },
    { name: "История посещения", path: "visit-history" },
    { name: "Дополнительная информация", path: "additional-info" },
  ];

  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Box
      sx={{
        width: globalsStyle.widthDrawer,
        bgcolor: theme.palette.background.default,
      }}
    >
      {isMobile ? (
        // Мобильная версия (Аккордеон)
        <Accordion sx={{
          '&.MuiAccordion-root': {
            position: 'absolute',
            width: '100%',
            top: 0,
            left: 0,
            zIndex: 2
          }
        }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Меню пациента</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {menuItems.map((item, index) => {
                const buttonStyles = {
                  ...patientMenuSx.listButton,
                  ...patientMenuSx.listButtonHover,
                  ...(location.pathname.endsWith(`/${item.path}`) && {
                    backgroundColor: globalsStyle.colors.blue,
                    color: theme.palette.common.white,
                  }),
                } as SxProps<Theme>;

                return (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      disableRipple
                      sx={buttonStyles}
                    >
                      <ListItemText primary={item.name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ) : (
        // Десктопная версия
        <List>
          {menuItems.map((item, index) => {
            const buttonStyles = {
              ...patientMenuSx.listButton,
              ...patientMenuSx.listButtonHover,
              ...(location.pathname.endsWith(`/${item.path}`) && {
                backgroundColor: globalsStyle.colors.blue,
                color: theme.palette.common.white,
              }),
            } as SxProps<Theme>;

            return (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  disableRipple
                  sx={buttonStyles}
                >
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
};