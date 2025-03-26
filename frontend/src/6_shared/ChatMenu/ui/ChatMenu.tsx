import { FC, useState } from "react";
import { List, ListItem, ListItemAvatar, ListItemText, useMediaQuery, Theme, ListItemButton, SxProps, useTheme, Box } from "@mui/material";
import { Link, useParams, useLocation } from "react-router-dom";
import { chatMenuSx } from "./chatMenuSx";
import { InputSearch } from "../../Input";
import { AvatarPerson } from "../../../5_entities/Avatar";
import { useUserChatRooms } from "@5_entities/chat/api/useUserChatRooms.ts"; // <-- Импортируем хук

export const ChatMenu: FC = () => {
  const { rooms, loading } = useUserChatRooms(); // <-- Получаем чаты
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const { id } = useParams();
  const theme = useTheme();
  const location = useLocation();
  const [search, setSearch] = useState('');

  const isDarkText = !(theme.palette.mode === "dark");

  const handleSearch = () => {
    console.log(search);
  };

  const filteredRooms = rooms
    .filter((room) => room !== null) // Фильтруем, убирая возможные null-значения
    .filter((room) => room.name.toLowerCase().includes(search.toLowerCase())); // Затем фильтруем по имени


  if (isMobile && id) return null;

  return (
    <>
      <Box sx={{ m: 1 }}>
        <InputSearch
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          placeholder="Поиск"
          onSearch={handleSearch}
          isDarkText={isDarkText}
        />
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", p: 2 }}>Загрузка...</Box>
      ) : (
        <List>
          {filteredRooms.map((room) => {
            const isSelected = location.pathname.endsWith(`/${room.id}`);

            const buttonStyles = {
              ...chatMenuSx.listButton,
              ...chatMenuSx.listButtonHover,
              ...(isSelected && {
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
                "&:active": {
                  color: theme.palette.common.black,
                },
              }),
            } as SxProps<Theme>;

            return (
              <ListItem key={room.id} disablePadding>
                <ListItemButton
                  component={Link}
                  to={`/chat/${room.id}`}
                  disableRipple
                  sx={buttonStyles}
                  selected={isSelected}
                >
                  <ListItemAvatar>
                    <AvatarPerson name={room.name} withMenu={false} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        {room.name}
                        {room.unreadCount > 0 && (
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: theme.palette.primary.main,
                            }}
                          />
                        )}
                      </div>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      )}
    </>
  );
};
