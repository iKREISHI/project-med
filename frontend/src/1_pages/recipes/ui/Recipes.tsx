// @ts-nocheck
import React, { useState } from 'react';
import { Box, Paper, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from '@6_shared/Button';
import { RecipesList } from '@5_entities/recipe';

export const Recipes: React.FC = () => {
  const theme = useTheme();
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 1, display: "flex", flexDirection: "column", gap: theme.spacing(2) }}>
        <Box sx={{ mb: 1 }}>
          <CustomButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/recipes/create")}
          >
            Добавить рецепт
          </CustomButton>
        </Box>
      </Box>

      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <RecipesList key={refreshKey} />
      </Box>

    </Box>
  );
};