import { FC } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { globalsStyleSx } from "@6_shared/styles/globalsStyleSx";
import { PatientMenu } from "@6_shared/PatientMenu";

export const Dictionaries: FC = () => {
    const isMobile = useMediaQuery("(max-width: 600px)");
  
  const menuItems = [
    { name: "Специализации", path: "specializations" },
    { name: "Филиалы", path: "filial" },
    { name: "Подразделения филиалов", path: "filial-department" },
    { name: "Должности", path: "positions" },
    { name: "Подразделения", path: "departments" },
    { name: "Типы карт", path: "card-types" },
  ];

  return (
    <Box sx={{ ...globalsStyleSx.container, overflow: 'hidden' }}>
      <Box sx={{
        position: 'relative',
      }}>
        {isMobile && (
          <Box sx={{
            width: '100%',
            zIndex: 1,
          }}>
            <PatientMenu menuItems={menuItems} />
          </Box>
        )}
        <Box sx={globalsStyleSx.flexContainerMenu}>
          {!isMobile && <PatientMenu menuItems={menuItems} />}
          <Box sx={{ 
            flex: 1, 
            mt: isMobile ? 6 : 0, 
            overflow: 'auto',
            p: 3,
            minHeight: '70vh'
          }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};