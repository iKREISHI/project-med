import { FC } from "react";
import { Box, List, ListItem, ListItemButton, ListItemText, useTheme, SxProps, Theme, Accordion, AccordionSummary, AccordionDetails, Typography, useMediaQuery, } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { globalsStyle } from "../../styles/globalsStyle.ts";
import { patientMenuSx } from "./patientMenuSx.ts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface PatientMenuProps {
  menuItems: { name: string; path: string }[]; 

}
// Отображение меню на странице пациента
export const PatientMenu: FC<PatientMenuProps> = ({menuItems}) => {

  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Box
      sx={{
        width: globalsStyle.widthDrawer,
        bgcolor: theme.palette.grey[100],
        boxShadow: '0px 0 3px rgba(0,0,0,0.1)',
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
                const isSelected = location.pathname.endsWith(`/${item.path}`);
                const buttonStyles = {
                    ...patientMenuSx.listButton,
                    ...patientMenuSx.listButtonHover,
                    ...(isSelected && {
                      boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
                      '&:active': {
                        color: theme.palette.common.black
                      }
    
                  }),
                } as SxProps<Theme>;

                return (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      disableRipple
                      sx={buttonStyles}
                      selected={isSelected}
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
        <List sx={{overflow: 'hidden'}}>
          {menuItems.map((item, index) => {
            const isSelected = location.pathname.endsWith(`/${item.path}`);
            const buttonStyles = {
                ...patientMenuSx.listButton,
                ...patientMenuSx.listButtonHover,
                ...(isSelected && {
                  boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
                  '&:active': {
                    color: theme.palette.common.black
                  }

              }),
            } as SxProps<Theme>;

            return (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  disableRipple
                  sx={buttonStyles}
                  selected={isSelected}
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