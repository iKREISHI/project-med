import React from 'react';
import { Box, Typography, Link, Divider, IconButton, useTheme } from '@mui/material';
import { Add } from '@mui/icons-material';
import { planeSx } from './planeSx';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface Task {
  task: string;
  date: string;
}

interface PlaneProps {
  tasks: Task[];
}

const Plane: React.FC<PlaneProps> = ({ tasks }) => {
  const theme = useTheme(); 

  return (
    <Box sx={planeSx.container}>
      <Box sx={planeSx.header}>
        <Typography variant="body1" sx={planeSx.title}>
          План
        </Typography>
        <Link component="button" variant="body2" sx={planeSx.addLink}>
          <Box sx={planeSx.linkContent}>
            <Add sx={planeSx.addIcon} />
            <Typography variant="body2">Добавить</Typography>
          </Box>
        </Link>
      </Box>
      <Divider sx={{ backgroundColor: theme.palette.primary.main }} />

      {tasks.map((task, index) => (
        <Box key={index} sx={planeSx.taskItem}>
          <Box sx={planeSx.taskContent}>
            <Typography variant="body1" sx={planeSx.taskText}>
              {task.task}
            </Typography>
            <Typography variant="body2" sx={planeSx.dateText}>
              {task.date}
            </Typography>
          </Box>
          <IconButton>
            <DeleteOutlineIcon sx={planeSx.deleteIcon} />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default Plane;