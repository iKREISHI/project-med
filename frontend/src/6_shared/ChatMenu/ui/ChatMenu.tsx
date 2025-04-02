// @ts-nocheck
// @ts-nocheck
import { FC, useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useMediaQuery,
  Theme,
  ListItemButton,
  SxProps,
  useTheme,
  Box,
  Menu,
  MenuItem,
  Divider,
  IconButton,
  Checkbox,
  Typography,
} from "@mui/material";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { chatMenuSx } from "./chatMenuSx";
import { InputForm, InputSearch } from "../../Input";
import { AvatarPerson } from "../../../5_entities/Avatar";
import { useUserChatRooms } from "@5_entities/chat/api/useUserChatRooms.ts";
import { useAllUsers } from "@5_entities/chat/api/useAllUsers.ts";
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCreateChatRoom } from "@5_entities/chat/api/useCreateChatRoom.ts";
import { CustomButton } from "@6_shared/Button";
import { getCurrentUser } from "@5_entities/user";

export const ChatMenu: FC = () => {
  const { rooms, loading: roomsLoading, loadMessages} = useUserChatRooms();
  const { users, loading: usersLoading } = useAllUsers();
  const { createRoom, loading: createRoomLoading } = useCreateChatRoom();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showUserList, setShowUserList] = useState(false);
  const [chatName, setChatName] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isGroupCreation, setIsGroupCreation] = useState(false);
  const open = Boolean(anchorEl);

  const isDarkText = !(theme.palette.mode === "dark");

  const handleSearch = () => {
    console.log(search);
  };
  
  useEffect(() => {
    if (id) {
      loadMessages(id);
    }
  }, [id, loadMessages]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateChat = () => {
    setShowUserList(true);
    setIsGroupCreation(false);
    setChatName('');
    setSelectedUserId(null);
    setSelectedUserIds([]);
    handleClose();
  };

  const handleCreateGroup = () => {
    setShowUserList(true);
    setIsGroupCreation(true);
    setChatName('');
    setSelectedUserId(null);
    setSelectedUserIds([]);
    handleClose();
  };

  const handleBackToChats = () => {
    setShowUserList(false);
    setIsGroupCreation(false);
    setChatName('');
    setSelectedUserId(null);
    setSelectedUserIds([]);
  };

  const handleUserSelect = (userId: string, userName: string) => {
    if (isGroupCreation) {
      setSelectedUserIds(prev => 
        prev.includes(userId) 
          ? prev.filter(id => id !== userId) 
          : [...prev, userId]
      );
    } else {
      setSelectedUserId(userId);
      if (!chatName) {
        setChatName(`Чат с ${userName}`);
      }
    }
  };
  
  const handleCreateNewChat = async () => {
    try {
      // Получаем текущего пользователя
      const currentUser = await getCurrentUser();
      const currentUserId = currentUser.id;
  
      // Проверяем условия создания чата
      if (isGroupCreation) {
        if (selectedUserIds.length < 1) {
          return;
        }
        if (!chatName.trim()) {
          return;
        }
      } else {
        if (!selectedUserId) {
          return;
        }
      }
  
      // Формируем список участников
      const participantIds = isGroupCreation 
        ? [...selectedUserIds.map(id => parseInt(id)), currentUserId]
        : [parseInt(selectedUserId), currentUserId];
  
      console.log('Участники чата:', participantIds);
  
      // Создаем данные для запроса
      const roomData = {
        name: chatName || (
          isGroupCreation 
            ? `Группа ${selectedUserIds.length + 1} участников`
            : `Чат с ${users.find(u => u.id === parseInt(selectedUserId!))?.name || 'пользователем'}`
        ),
        participant_ids: participantIds,
        room_type: isGroupCreation ? 'group' : 'private',
        creator_id: currentUserId
      };
  
      console.log('Данные для создания:', roomData);
  
      const newRoom = await createRoom(roomData);
      
      if (newRoom?.id) {
        console.log(`Чат успешно создан! ID: ${newRoom.id}`);
        navigate(`/chat/${newRoom.id}`);
        setShowUserList(false);
        setChatName('');
        setSelectedUserId(null);
        setSelectedUserIds([]);
        setIsGroupCreation(false);
      } else {
        console.error('Ошибка: сервер не вернул ID чата');
      }
    } catch (error) {
      console.error('Ошибка создания чата:', error);
    } 
  };
  const filteredRooms = rooms
    .filter((room) => room !== null)
    .filter((room) => room.name.toLowerCase().includes(search.toLowerCase()));

  const filteredUsers = users
    .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box sx={{ position: 'relative', height: '80vh' }}>
      <Box sx={{
        m: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <InputSearch
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          placeholder={showUserList ? "Поиск пользователей" : "Поиск чатов"}
          onSearch={handleSearch}
          isDarkText={isDarkText}
        />

        <IconButton
          color="primary"
          aria-label="add"
          onClick={handleClick}
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              bgcolor: 'primary.dark'
            }
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Divider />

      {showUserList ? (
        <>
          <Box sx={{ p: 0.5, display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1 }}>
            <IconButton onClick={handleBackToChats} disableRipple>
              <ArrowBackIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }}>
              <InputForm
                fullWidth
                placeholder={isGroupCreation ? "Название группы" : "Название чата"}
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
              />
            </Box>
          </Box>

          {isGroupCreation && selectedUserIds.length > 0 && (
            <Typography variant="body2" sx={{ px: 2, py: 1 }}>
              Выбрано: {selectedUserIds.length}
            </Typography>
          )}

          {usersLoading ? (
            <Box sx={{ textAlign: "center", p: 2 }}>Загрузка пользователей...</Box>
          ) : (
            <List>
              {filteredUsers.map((user) => (
                <ListItem 
                  key={user.id} 
                  disablePadding
                  secondaryAction={
                    isGroupCreation && (
                      <Checkbox
                        edge="end"
                        checked={selectedUserIds.includes(user.id.toString())}
                        onChange={() => handleUserSelect(user.id.toString(), user.name)}
                      />
                    )
                  }
                >
                  <ListItemButton
                    onClick={() => handleUserSelect(user.id.toString(), user.name)}
                    disableRipple
                    sx={{
                      ...chatMenuSx.listButton,
                      ...chatMenuSx.listButtonHover,
                      ...(!isGroupCreation && selectedUserId === user.id.toString() && {
                        backgroundColor: theme.palette.action.selected,
                      }),
                    }}
                  >
                    <ListItemAvatar>
                      <AvatarPerson name={user.name} withMenu={false} />
                    </ListItemAvatar>
                    <ListItemText primary={user.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}

          {(selectedUserId || (isGroupCreation && selectedUserIds.length > 0)) && (
            <Box sx={{ p: 2, position: 'sticky', bottom: 0, bgcolor: 'background.paper' }}>
              <CustomButton
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleCreateNewChat}
                disabled={
                  isGroupCreation 
                    ? !chatName.trim() || createRoomLoading 
                    : (!chatName.trim() || createRoomLoading)
                }
              >
                {createRoomLoading 
                  ? "Создание..." 
                  : isGroupCreation 
                    ? "Создать группу" 
                    : "Создать чат"}
              </CustomButton>
            </Box>
          )}
        </>
      ) : (
        <>
          {roomsLoading ? (
            <Box sx={{ textAlign: "center", p: 2 }}>Загрузка чатов...</Box>
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
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleCreateChat}>Создать чат</MenuItem>
        <MenuItem onClick={handleCreateGroup}>Создать группу</MenuItem>
      </Menu>
    </Box>
  );
};