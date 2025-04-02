// src/services/recipesApi.ts
const API_BASE_URL = 'http://87.228.37.14:61509/api'; // Добавлен /api, если требуется
const ACCESS_TOKEN = '550e8400-e29b-41d4-a716-446655440000';

export const fetchRecipes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Если используется куки-аутентификация
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

export const createRecipe = async (recipeData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create recipe');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};