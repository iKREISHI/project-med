import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, useTheme, Popover, Pagination, Stack, Tooltip, Paper, Chip, CircularProgress } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import { planeSx } from './planeSx.ts';
import { getAllNotifications } from '@5_entities/notification/api/getAllNotification.ts';
import { PaginatedNotificationList } from '@5_entities/notification/model/model.ts';

interface PlaneProps {
  initialNotifications?: Notification[];
}

const Plane: React.FC<PlaneProps> = ({ initialNotifications = [] }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<PaginatedNotificationList>({
    count: 0,
    next: null,
    previous: null,
    results: initialNotifications
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notificationsPerPage = 5;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getAllNotifications({
          page,
          page_size: notificationsPerPage,
        });
        setNotifications(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки уведомлений');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [page]);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, notification: Notification) => {
    setSelectedNotification(notification);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'primary';
      case 'read': return 'success';
      case 'unread': return 'warning';
      default: return 'default';
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <Box sx={planeSx.container}>
      <Box sx={planeSx.header}>
        <Typography variant="body1" sx={planeSx.title}>
          Уведомления
        </Typography>
        <Notifications sx={{ color: theme.palette.grey[600] }} />
      </Box>
      <Divider sx={{ backgroundColor: theme.palette.grey[700] }} />

      {loading && (
        <Box>
          <CircularProgress size={24} />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ p: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && notifications.results.map((notification, index) => (
        <Tooltip
          key={notification.id}
          title={`Статус: ${notification.status}`}
          arrow
          placement="top"
        >
          <Box
            sx={planeSx.taskItem}
            onClick={(e) => handlePopoverOpen(e, notification)}
            aria-describedby={id}
          >
            <Box sx={planeSx.taskContent}>
              <Typography variant="body1" sx={planeSx.taskText}>
                {notification.message}
              </Typography>
              <Box>
                <Typography variant="body2" sx={planeSx.dateText}>
                  {new Date(notification.date).toLocaleString()}
                </Typography>
                <Chip
                  label={notification.status === 'delivered' ? 'Новое' : notification.status}
                  size="small"
                  color={getStatusColor(notification.status)}
                />
              </Box>
            </Box>
          </Box>
        </Tooltip>
      ))}

      {notifications.count > 0 && (
        <Stack spacing={2} sx={planeSx.paginationContainer}>
          <Pagination
            count={Math.ceil(notifications.count / notificationsPerPage)}
            page={page}
            onChange={handlePageChange}
            size="small"
          />
        </Stack>
      )}

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={planeSx.popoverContent}>
          {selectedNotification && (
            <>
              <Typography variant="subtitle1">
                {selectedNotification.message}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={selectedNotification.status === 'delivered' ? 'Новое' : selectedNotification.status}
                  size="small"
                  color={getStatusColor(selectedNotification.status)}
                />
                <Typography variant="caption">
                  {new Date(selectedNotification.date).toLocaleString()}
                </Typography>
              </Box>

              <Divider sx={{ mb: 1, mt: 1 }} />

              <Box >
                <Typography variant="body2">
                  Создано: {new Date(selectedNotification.date_created).toLocaleString()}
                </Typography>
                {selectedNotification.date_delivered && (
                  <Typography variant="body2">
                    Доставлено: {new Date(selectedNotification.date_delivered).toLocaleString()}
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Popover>
    </Box>
  );
};

export default Plane;